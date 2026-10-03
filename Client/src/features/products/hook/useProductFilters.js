import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSearch,
  selectSort,
  setSearch as setSearchAction,
  setSort as setSortAction,
  resetFilters as resetFiltersAction,
} from "@/features/products/state/productFiltersSlice";

export default function useProductFilters() {
  const dispatch = useDispatch();
  const search = useSelector(selectSearch);
  const sort = useSelector(selectSort);

  const setSearch = useCallback(
    (value) => dispatch(setSearchAction(value)),
    [dispatch],
  );

  const setSort = useCallback(
    (value) => dispatch(setSortAction(value)),
    [dispatch],
  );

  const resetFilters = useCallback(
    () => dispatch(resetFiltersAction()),
    [dispatch],
  );

  return { search, sort, setSearch, setSort, resetFilters };
}
