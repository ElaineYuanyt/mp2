import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMeals } from '../mealdb';

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
}

const ListView: React.FC = () => {
    const [query, setQuery] = useState('');
    const [meals, setMeals] = useState<Meal[]>([]);
    const [sortBy, setSortBy] = useState<'name' | 'category' | 'area'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch meals as user types
    useEffect(() => {
        const fetchMeals = async () => {
        if (query.trim() === '') {
            setMeals([]);
            return;
        }
        setLoading(true);
        try {
            const results = await searchMeals(query);
            setMeals(results);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
        };

        const delayDebounce = setTimeout(fetchMeals, 400);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    // Sort meals
    const sortedMeals = [...meals].sort((a, b) => {
        let aValue = '';
        let bValue = '';

        switch (sortBy) {
        case 'name':
            aValue = a.strMeal;
            bValue = b.strMeal;
            break;
        case 'category':
            aValue = a.strCategory;
            bValue = b.strCategory;
            break;
        case 'area':
            aValue = a.strArea;
            bValue = b.strArea;
            break;
        }

        if (sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });

    const handleMealClick = (meal: Meal) => {
        navigate(`/detail/${meal.idMeal}`, { 
            state: { mealList: sortedMeals } 
        });
    };

    return (
        <div className="list-view">
            <div className="welcome-message">
                <h2>Welcome to Smart Kitchen Recipe Finder!</h2>
                <p>Start typing in the search bar to find delicious recipes from around the world.</p>
            </div>
            
            <div className="search-section">
                <div className="search-bar-container">
                    <input
                    type="text"
                    placeholder="Search meals..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-bar"
                    />
                </div>

                <div className="sort-controls">
                    <div className="sort-group">
                        <label htmlFor="sortBy">Sort by:</label>
                        <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'area')}
                        className="sort-select"
                        >
                            <option value="name">Name</option>
                            <option value="category">Category</option>
                            <option value="area">Area</option>
                        </select>
                    </div>

                    <div className="sort-group">
                        <label htmlFor="sortOrder">Order:</label>
                        <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        className="sort-select"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && <div className="loading">Loading...</div>}

            <div className="results">
                {sortedMeals.map((meal) => (
                    <div
                    key={meal.idMeal}
                    className="meal-card"
                    onClick={() => handleMealClick(meal)}
                    >
                        <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
                        <div className="meal-info">
                            <h3 className="meal-name">{meal.strMeal}</h3>
                            <p className="meal-category">{meal.strCategory}</p>
                            <p className="meal-area">{meal.strArea}</p>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && query && sortedMeals.length === 0 && (
                <div className="no-results">
                    <p>No meals found for "{query}"</p>
                </div>
            )}
        </div>
    );
};

export default ListView;
