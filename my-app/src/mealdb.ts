import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Search meals by name
export const searchMeals = async (query: string) => {
    const response = await axios.get(`${BASE_URL}/search.php?s=${query}`);
    return response.data.meals || [];
};

// Get meal details by ID
export const getMealById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
    return response.data.meals ? response.data.meals[0] : null;
};

// Get all categories
export const getCategories = async () => {
    const response = await axios.get(`${BASE_URL}/list.php?c=list`);
    return response.data.meals?.map((cat: any) => cat.strCategory) || [];
};

// Get all areas
export const getAreas = async () => {
    const response = await axios.get(`${BASE_URL}/list.php?a=list`);
    return response.data.meals?.map((area: any) => area.strArea) || [];
};
