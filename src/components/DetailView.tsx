import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getMealById } from '../mealdb';

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strTags?: string;
    ingredients: { ingredient: string; measure: string }[];
}

const DetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [meal, setMeal] = useState<Meal | null>(null);
    const [loading, setLoading] = useState(true);
    const [mealList, setMealList] = useState<Meal[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchMealDetails = async () => {
        if (!id) return;
        
        try {
            setLoading(true);
            const mealData = await getMealById(id);
            
            if (mealData) {
                const ingredients = [];
                for (let i = 1; i <= 20; i++) {
                    const ingredient = mealData[`strIngredient${i}`];
                    const measure = mealData[`strMeasure${i}`];
                    if (ingredient && ingredient.trim()) {
                        ingredients.push({
                            ingredient: ingredient.trim(),
                            measure: measure ? measure.trim() : ''
                        });
                    }
                }

                const mealWithIngredients = {
                    ...mealData,
                    ingredients
                };

                setMeal(mealWithIngredients);

                const mealListFromState = location.state?.mealList || [mealWithIngredients];
                setMealList(mealListFromState);
                
                const index = mealListFromState.findIndex((m: Meal) => m.idMeal === id);
                setCurrentIndex(index >= 0 ? index : 0);
            }
        } catch (error) {
            console.error('Error fetching meal details:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchMealDetails();
    }, [id, location.state]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevMeal = mealList[currentIndex - 1];
            navigate(`/detail/${prevMeal.idMeal}`, { 
                state: { mealList } 
            });
        }
    };

    const handleNext = () => {
        if (currentIndex < mealList.length - 1) {
            const nextMeal = mealList[currentIndex + 1];
            navigate(`/detail/${nextMeal.idMeal}`, { 
                state: { mealList } 
            });
        }
    };

    const handleBackToList = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="loading">Loading meal details...</div>;
    }

    if (!meal) {
        return (
            <div className="error">
                <h2>Meal not found</h2>
                <button onClick={handleBackToList} className="back-btn"> 
                    ← Back
                </button>
            </div>
        );
    }

    return (
        <div className="detail-view">
            <div className="detail-header">
                <button onClick={handleBackToList} className="back-btn">
                    ← Back
                </button>
                
                <div className="navigation-controls">
                    <button
                    onClick={handlePrevious} 
                    disabled={currentIndex === 0}
                    className="nav-btn prev-btn"
                    >
                        ← Previous
                    </button>
                    <span className="nav-counter">
                        {currentIndex + 1} of {mealList.length}
                    </span>
                    <button 
                    onClick={handleNext} 
                    disabled={currentIndex === mealList.length - 1}
                    className="nav-btn next-btn"
                    >
                        Next →
                    </button>
                </div>
            </div>

            <div className="detail-content">
                <div className="detail-image-section">
                    <img
                    src={meal.strMealThumb} 
                    alt={meal.strMeal} 
                    className="detail-image"
                    />
                </div>
  
                <div className="detail-info-section">
                    <h1 className="detail-title">{meal.strMeal}</h1>
                    
                    <div className="detail-meta">
                        <div className="meta-item">
                            <strong>Category:</strong> {meal.strCategory}
                        </div>
                        <div className="meta-item">
                            <strong>Area:</strong> {meal.strArea}
                        </div>
                        {meal.strTags && (
                            <div className="meta-item">
                                <strong>Tags:</strong> {meal.strTags}
                            </div>
                        )}
                    </div>

                    <div className="ingredients-section">
                        <h3>Ingredients</h3>
                        <div className="ingredients-grid">
                            {meal.ingredients.map((ingredient, index) => (
                                <div key={index} className="ingredient-item">
                                    <span className="ingredient-name">{ingredient.ingredient}</span>
                                    {ingredient.measure && (
                                        <span className="ingredient-measure">- {ingredient.measure}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="instructions-section">
                        <h3>Instructions</h3>
                        <div className="instructions-text">
                            {meal.strInstructions.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailView;
