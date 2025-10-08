import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMeals, getCategories, getAreas } from '../mealdb';

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
}

const GalleryView: React.FC = () => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [areas, setAreas] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch all meals and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const [allMeals, categoryList, areaList] = await Promise.all([
                    searchMeals('a'),
                    getCategories(),
                    getAreas()
                ]);
                
                setMeals(allMeals);
                setFilteredMeals(allMeals);
                setCategories(categoryList);
                setAreas(areaList);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter meals based on selected categories and areas
    useEffect(() => {
        let filtered = [...meals];

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(meal => selectedCategories.includes(meal.strCategory));
        }

        if (selectedAreas.length > 0) {
            filtered = filtered.filter(meal => selectedAreas.includes(meal.strArea));
        }

        setFilteredMeals(filtered);
    }, [meals, selectedCategories, selectedAreas]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev => 
        prev.includes(category) 
            ? prev.filter(c => c !== category)
            : [...prev, category]
        );
    };

    const handleAreaChange = (area: string) => {
        setSelectedAreas(prev => 
        prev.includes(area) 
            ? prev.filter(a => a !== area)
            : [...prev, area]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedAreas([]);
    };

    const handleMealClick = (meal: Meal) => {
        navigate(`/detail/${meal.idMeal}`, { 
            state: { mealList: filteredMeals } 
        });
    };

    if (loading) {
        return <div className="loading">Loading gallery...</div>;
    }

    return (
        <div className="gallery-view">
            <div className="gallery-header">
                <h2>Recipe Gallery</h2>
            </div>

            <div className="filters-section">
                <div className="filter-group">
                    <h3>Categories</h3>
                    <div className="filter-options">
                        {categories.map(category => (
                        <label key={category} className="filter-option">
                            <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            />
                            <span>{category}</span>
                        </label>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <h3>Areas</h3>
                    <div className="filter-options">
                        {areas.map(area => (
                            <label key={area} className="filter-option">
                                <input
                                type="checkbox"
                                checked={selectedAreas.includes(area)}
                                onChange={() => handleAreaChange(area)}
                                />
                                <span>{area}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button onClick={clearFilters} className="clear-filters-btn">
                    Clear Filters
                </button>
            </div>

            <div className="gallery-grid">
                {filteredMeals.map((meal) => (
                    <div
                    key={meal.idMeal}
                    className="gallery-item"
                    onClick={() => handleMealClick(meal)}
                    >
                        <img src={meal.strMealThumb} alt={meal.strMeal} className="gallery-image" />
                        <div className="gallery-overlay">
                            <h3 className="gallery-title">{meal.strMeal}</h3>
                            <p className="gallery-category">{meal.strCategory}</p>
                            <p className="gallery-area">{meal.strArea}</p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMeals.length === 0 && (
                <div className="no-results">
                    <p>No recipes match the selected filters</p>
                </div>
            )}
        </div>
    );
};

export default GalleryView;
