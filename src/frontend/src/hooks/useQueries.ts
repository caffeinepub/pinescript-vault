import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Bundle, UserProfile, InviteStatus, InviteStatusType } from '../backend';
import { ExternalBlob } from '../backend';
import type { Principal } from '@dfinity/principal';

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getProduct(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetAllCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBundles() {
  const { actor, isFetching } = useActor();

  return useQuery<Bundle[]>({
    queryKey: ['bundles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBundles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBundle(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Bundle | null>({
    queryKey: ['bundle', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getBundle(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCreateBundle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bundle: Bundle) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createBundle(bundle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}

export function useUpdateBundle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bundle: Bundle) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateBundle(bundle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}

export function useDeleteBundle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteBundle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripe', 'configured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInviteStatuses() {
  const { actor, isFetching } = useActor();

  return useQuery<InviteStatus[]>({
    queryKey: ['inviteStatuses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInviteStatuses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyInviteStatuses() {
  const { actor, isFetching } = useActor();

  return useQuery<InviteStatus[]>({
    queryKey: ['myInviteStatuses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyInviteStatuses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateInviteStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      username: string;
      status: InviteStatusType;
      productId: string;
      orderId: string;
      buyer: Principal;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateInviteStatus(
        params.username,
        params.status,
        params.productId,
        params.orderId,
        params.buyer
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteStatuses'] });
      queryClient.invalidateQueries({ queryKey: ['myInviteStatuses'] });
    },
  });
}
