import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
    tradingViewUsername?: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Bundle {
    id: string;
    priceAmount: bigint;
    productIds: Array<string>;
    name: string;
    description: string;
    currency: string;
}
export interface InviteStatus {
    status: InviteStatusType;
    username: string;
    productId: string;
    orderId: string;
    timestamp: bigint;
    buyer: Principal;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Product {
    id: string;
    requiresInvite: boolean;
    title: string;
    priceAmount: bigint;
    codePreview: string;
    slug: string;
    isFree: boolean;
    isPaid: boolean;
    instructions: string;
    shortDescription: string;
    hasScreenshots: boolean;
    currency: string;
    category: string;
    disclaimer: string;
    downloadableFile?: ExternalBlob;
    longDescription: string;
}
export enum InviteStatusType {
    expired = "expired",
    pending = "pending",
    granted = "granted",
    usernameIncorrect = "usernameIncorrect"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBundle(bundle: Bundle): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createInviteStatus(username: string, status: InviteStatusType, productId: string, orderId: string, buyer: Principal): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteBundle(id: string): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getAllBundles(): Promise<Array<Bundle>>;
    getAllCategories(): Promise<Array<string>>;
    getAllProducts(): Promise<Array<Product>>;
    getBundle(id: string): Promise<Bundle>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCartTotal(items: Array<CartItem>): Promise<bigint>;
    getCartTotalWithShipping(items: Array<CartItem>, shipping: bigint): Promise<bigint>;
    getInviteStatuses(): Promise<Array<InviteStatus>>;
    getMyInviteStatuses(): Promise<Array<InviteStatus>>;
    getProduct(id: string): Promise<Product>;
    getProductPriceAmount(productId: string): Promise<bigint>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBundle(bundle: Bundle): Promise<void>;
    updateInviteStatus(username: string, status: InviteStatusType, productId: string, orderId: string, buyer: Principal): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
