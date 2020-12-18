const express = require('express');
const controller = require('../controller/index');

var recipeRouter = express.Router();

// welcome api masak apa
recipeRouter.route('/').get((req, res, next) => {
    res.send({
        message : "Bingung mau masak apa hari ini? Temukan berbagai resep di link berikut 👇",
        link : "https://www.masakapahariini.com/"
    });
});

// RESEP - RESEP
recipeRouter.get('/semua-resep', controller.newRecipes);    // menampilkan semua resep
recipeRouter.get('/semua-resep/:halaman', controller.newRecipesByPage); // menampilkan semua resep ber halaman

// RESEP & KATEGORI
recipeRouter.get('/resep/kategori', controller.category); // semua resep serta kategorinya
recipeRouter.get('/resep/kategori/:key', controller.recipesByCategory); // menampilkan semua resep berdasarkan kategori tertentu
recipeRouter.get('/resep/kategori/:key/:halaman', controller.recipesCategoryByPage); // menampilkan semua resep berdasarkan kategori tertentu dan per halaman

// ARTIKEL
recipeRouter.get('/artikel', controller.article); // menampilkan semua artikel
recipeRouter.get('/artikel/kategori', controller.articleCategory); // menampilkan semua artikel & kategorinya
recipeRouter.get('/artikel/kategori/:key', controller.articleByCategory); // menampilkan semua artikel & kategorinya tertentu

// CARI RESEP
recipeRouter.get('/:key', controller.recipesDetail); // mencari resep masakan tertentu

module.exports = recipeRouter;