import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/eventbrite/categories'); // Proxy route
            console.log('Categories:', response.data);
            setCategories(response.data.categories); // Assuming categories are in 'categories' array
        } catch (err) {
            console.error('Error fetching categories:', err.response?.data || err.message);
            setError('Failed to fetch categories');
        }
    };

        fetchCategories();
    }, []);

    return (
        <div>
            <h1>Category List</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        <strong>{category.name}</strong> - {category.short_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
