const express = require('express');
const router = express.Router();
const pgClient = require('./../db/pg-controller');


router.get('/', (req, res) => {
    pgClient.query('SELECT * FROM recipes ORDER BY date_of_creation LIMIT 9', (err, result) => {
        if (err) throw err;
        res.render('./recipes/front_page', { recipes: result.rows });
    });
});

router.get('/old', (req, res) => {
    let recipes;
    pgClient.query('SELECT * FROM recipes', (err, result) => {
        if (err) throw err;
        recipes = result.rows;
    });
    res.render('./recipes/front_page_old', { scriptName: '/javascripts/script.js' });
});

router.get('/search/name', (req, res) => {
    const queryString = "SELECT * FROM recipes WHERE LOWER(recipe_name) LIKE $1;";
    const value = req.query['searchRecipeName'];

    pgClient.query(queryString, ['%' + value + '%'], (err, result) => {
        if (err) throw err;
        res.render('./recipes/recipe_search_name', { searchString: value, recipes: result.rows, scriptName: '/javascripts/script_recipe_search_name.js' });
    });
});

router.get('/search/categories', (req, res) => {
    // Read values from categories form
    var arr = req.query['categories-checkboxes'];

    // Check if there is more than one value passed by form
    if (!Array.isArray(arr)) {
        // If there isn't, push existing values to empty array
        var ops = [];
        ops.push(arr);
    } else {
        // If there is, copy values to new array
        var ops = arr;
    }

    // Determine how many parameters are needed in PG Query - for each create $i string
    var params = [];
    for (var i = 1; i <= ops.length; i++) {
        params.push('$' + i);
    }

    // Generate query string with $i's
    const queryString = `SELECT DISTINCT ON (r.recipe_name) recipe_name, r.*, cpr.recipe_id, cpr.category_id, c.category_name FROM recipes r 
    JOIN categories_per_recipe cpr ON cpr.recipe_id = r.id_recipe
    JOIN categories c ON cpr.category_id = c.id_category
    WHERE c.category_name IN (${params.join(',')})`;

    // Query PostgreSQL - ops have to be an array (even if there is only one value within)
    pgClient.query(queryString, ops, (err, result) => {
        if (err) throw err;
        res.render('./recipes/recipe_search_categories', { searchedCategories: ops, recipes: result.rows });
    });

});

router.get('/api/all', (req, res) => {
    let getAllRecipes = `SELECT r.*, u.nickname
    FROM recipes r JOIN users u ON u.id_user = r.user_id
    JOIN categories_per_recipe cpr ON cpr.recipe_id = r.id_recipe
    JOIN categories c ON cpr.category_id = c.id_category
    GROUP BY r.id_recipe, u.nickname
    ORDER BY date_of_creation`;
    pgClient.query(getAllRecipes, (err, result) => {
        res.json(result.rows);
    });
});

router.get('/api/id/:id', (req, res) => {
    const queryString = 'SELECT * FROM recipes WHERE id_recipe = $1';
    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value, (err, result) => {
        if (err) throw err;
        res.json(result.rows);
    });
});

router.get('/api/name/:name', (req, res) => {
    const queryString = "SELECT * FROM recipes WHERE LOWER(recipe_name) LIKE $1";
    console.log([req.params.name]);
    const value = req.params.name;

    pgClient.query(queryString, ['%' + value + '%'], (err, result) => {
        if (err) throw err;
        console.log(result.rows);
        res.json(result.rows);
    });
});


module.exports = router;