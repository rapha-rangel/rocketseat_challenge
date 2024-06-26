import { PromiseFetchTypes } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";
import { useFilter } from "./useFilter";
import { mountQuery} from "@/utils/graphql-functions";
import { useDeferredValue } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const fetcher = (query:string): AxiosPromise<PromiseFetchTypes> =>{
  return axios.post(API_URL,{query})
}

export function useProducts(){
  const {type, priority, search, page} = useFilter();
  const searchDeferred = useDeferredValue(search);
  const query = mountQuery(type, priority, page);
  const {data} = useQuery({
    queryFn:()=> fetcher(query),
    queryKey:["products", type, priority,page],
    staleTime: 1000*60
  });

  const productsResponse = data?.data?.data?.allProducts;
  const productsSearchFilter = productsResponse?.filter( product=>product.name.toLowerCase().includes(searchDeferred.toLowerCase()))
  return {
    data: productsSearchFilter
  }
}