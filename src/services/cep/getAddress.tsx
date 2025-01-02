"use client";
import { useQuery } from "@tanstack/react-query";

export const getAddress = async (cep: string) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  return await response.json();
};

export const useGetAddress = (cep: string | undefined) => {
  return useQuery({
    queryKey: ["userMetadata", cep],
    queryFn: () => getAddress(cep!),
    enabled: cep?.length === 8,
    refetchOnWindowFocus: false,
  });
};
