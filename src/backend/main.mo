import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
    tradingViewUsername : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Data types
  public type Product = {
    id : Text; // UUID for backend reference
    title : Text;
    slug : Text;
    shortDescription : Text;
    longDescription : Text;
    priceAmount : Nat;
    currency : Text;
    isFree : Bool;
    isPaid : Bool;
    category : Text;
    hasScreenshots : Bool; // true if screenshots used
    instructions : Text;
    codePreview : Text;
    disclaimer : Text;
    requiresInvite : Bool;
    downloadableFile : ?Storage.ExternalBlob;
  };

  module ProductInternal {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  public type Bundle = {
    id : Text; // UUID for backend reference
    name : Text;
    description : Text;
    priceAmount : Nat;
    currency : Text;
    productIds : [Text];
  };

  public type Order = {
    id : Text;
    buyer : Principal;
    product : Product; // Embedded snapshot
    bundle : ?Bundle; // Embedded snapshot
    purchaseAmount : Nat;
    purchaseTime : Int;
  };

  public type DownloadToken = {
    token : Text;
    productId : Text;
    expiry : Time.Time;
  };

  public type InviteStatus = {
    username : Text;
    status : InviteStatusType;
    productId : Text;
    orderId : Text;
    buyer : Principal;
    timestamp : Int;
  };

  public type InviteStatusType = {
    #pending;
    #granted;
    #expired;
    #usernameIncorrect;
  };

  // Stores
  let products = Map.empty<Text, Product>();
  let categories = Set.empty<Text>();
  let bundles = Map.empty<Text, Bundle>();
  let orders = Map.empty<Text, Order>();
  let downloadTokens = Map.empty<Text, DownloadToken>();
  let inviteStatuses = List.empty<InviteStatus>();

  // Stripe configuration
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be configured first") };
      case (?config) { config };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Product CRUD
  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    categories.add(product.category);
    products.add(product.id, product);
  };

  public query ({ caller }) func getProduct(id : Text) : async Product {
    // Public access - anyone can view products
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(product.id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_old) {
        products.add(product.id, product);
        categories.add(product.category);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.remove(id);
      };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    // Public access - storefront needs this
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    // Public access - storefront filtering
    products.values().toArray().filter(func(p) { p.category == category });
  };

  // Category management
  public query ({ caller }) func getAllCategories() : async [Text] {
    // Public access - storefront navigation
    categories.values().toArray();
  };

  // Bundle CRUD
  public shared ({ caller }) func createBundle(bundle : Bundle) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create bundles");
    };
    bundles.add(bundle.id, bundle);
  };

  public query ({ caller }) func getBundle(id : Text) : async Bundle {
    // Public access - anyone can view bundles
    switch (bundles.get(id)) {
      case (null) { Runtime.trap("Bundle not found") };
      case (?bundle) { bundle };
    };
  };

  public shared ({ caller }) func updateBundle(bundle : Bundle) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update bundles");
    };
    switch (bundles.get(bundle.id)) {
      case (null) { Runtime.trap("Bundle not found") };
      case (?_) {
        bundles.add(bundle.id, bundle);
      };
    };
  };

  public shared ({ caller }) func deleteBundle(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete bundles");
    };
    switch (bundles.get(id)) {
      case (null) { Runtime.trap("Bundle not found") };
      case (?_) {
        bundles.remove(id);
      };
    };
  };

  public query ({ caller }) func getAllBundles() : async [Bundle] {
    // Public access - storefront needs this
    bundles.values().toArray();
  };

  // Shopping cart
  public type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  public query ({ caller }) func getProductPriceAmount(productId : Text) : async Nat {
    // Public access - needed for cart calculations
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product.priceAmount };
    };
  };

  public func getCartTotal(items : [CartItem]) : async Nat {
    // Public access - cart total calculation
    var total = 0;
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found: " # item.productId) };
        case (?product) {
          total += product.priceAmount * item.quantity;
        };
      };
    };
    total;
  };

  public func getCartTotalWithShipping(items : [CartItem], shipping : Nat) : async Nat {
    // Public access - cart total with shipping
    var total = shipping;
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found: " # item.productId) };
        case (?product) {
          total += product.priceAmount * item.quantity;
        };
      };
    };
    total;
  };

  // Digital downloads & invites
  public shared ({ caller }) func createInviteStatus(username : Text, status : InviteStatusType, productId : Text, orderId : Text, buyer : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create invites");
    };

    let inviteStatus = {
      username;
      status;
      productId;
      orderId;
      buyer;
      timestamp = Time.now();
    };

    inviteStatuses.add(inviteStatus);
  };

  public shared ({ caller }) func updateInviteStatus(username : Text, status : InviteStatusType, productId : Text, orderId : Text, buyer : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update invites");
    };

    let inviteStatus = {
      username;
      status;
      productId;
      orderId;
      buyer;
      timestamp = Time.now();
    };
    inviteStatuses.add(inviteStatus);
  };

  public query ({ caller }) func getInviteStatuses() : async [InviteStatus] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view invite statuses");
    };
    inviteStatuses.toArray();
  };

  public query ({ caller }) func getMyInviteStatuses() : async [InviteStatus] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their invite statuses");
    };
    inviteStatuses.toArray().filter(func(invite) { invite.buyer == caller });
  };
};
