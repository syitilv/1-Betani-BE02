const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
 
const Crop = require('../models/crops');
 
var cropRouter = express.Router();
 
cropRouter.use(bodyParser.json());

cropRouter.route('/') 
//GET all crops (halaman utama pembeli) DONE
  .get((req, res, next) => {
    Crop.find({})
      .then((hasil) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(hasil);
      });
  })
  //POST crops (farmer) DONE
  .post((req, res, next) => { 
    Crop.create(req.body)
      .then((hasil_tani) => {
        console.log('Hasil Pertanian Ditambahkan', hasil_tani);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(hasil_tani);
      });
  })
  //PUT crops //DONE
  .put((req, res, next) => { 
    res.statusCode = 403;
    res.end('Put operation is not supported');
  })
  //DELETE crops //DONE
  .delete((req, res, next) => { 
    res.statusCode = 403;
    res.end('Delete operation is not supported');
  });

//--------------------------------------------------------------------------
//BERDASARKAN ID HASIL TANI => HAK AKSES PEMBELI
cropRouter.route("/:id_crop/")
//GET crop by Id_crop (pembeli) DONE
.get((req, res, next) => { 
    Crop.findById(req.params.id_crop)  
    .then((hasil)=>{
        if (hasil) {
            res.statusCode = 200
            res.setHeader('Content-type','application/json')
            res.json(hasil) 
        }
        else{
            res.statusCode = 404;
            res.end('Hasil Pertanian Belum Ada');
        }
    })
})
//POST crop by Id_crop DONE
.post((req, res, next) => { 
    res.statusCode = 403
    res.end('POST Operation is not supported')
})
//PUT crop by Id_crop DONE
.put((req, res, next) => { 
  Crop.findByIdAndUpdate(req.params.id_crop, {$set: req.body}, {new: true})
  .then((update) => {
      if(update == null){
          res.statusCode = 403;
          res.end('Data Hasil Pertanian Tidak Ditemukan!');
      }else{
          res.statusCode = 200;
          res.json(update);
      }
  })
})
//DELETE crop by Id_crop DONE
.delete((req, res, next) => { 
  Crop.findByIdAndDelete(req.params.id_crop)
  .then((hapus) => {
      if(hapus == null){
          res.statusCode = 403;
          res.end('Hasil Pertanian Tidak Ditemukan!');
      }else{
          hapus.save();
          res.end('Hasil Pertanian Berhasil Dihapus');
      }
  });
})

//--------------------------------------------------------------------------
//BERDASARKAN ID PETANI => HAK AKSES PETANI
cropRouter.route("/:id_farmer/crops")
//GET crop by Id_farmer (petani) DONE
.get((req, res, next) => { 
  Crop.find({"id_farmers" : req.params.id_farmer})  
  .then((hasil)=>{
      if (hasil) {
          res.statusCode = 200
          res.setHeader('Content-type','application/json')
          res.json(hasil) 
      }
      else{
          res.statusCode = 404;
          res.end('Hasil Pertanian Belum Ada');
      }
  })
})
//DELETE crop by Id_farmer (petani) DONE
.delete((req, res, next) => {
  Crop.deleteMany({"id_farmers" : req.params.id_farmer})
  .then((hapus) => {
      console.log('Data Semua Hasil Pertanian Berhasil Dihapus');
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(hapus);
  })
})


//--------------------------------------------------------------------------
//BERDASARKAN ID PETANI & ID HASIL TANI => HAK AKSES PETANI
// cropRouter.route("/:id_farmer/crops/:id_crop")
// // NEED SOLVE
// .get((req, res, next) => { 
//   Crop.find({$or:[{_id : req.params.id_crop},{ "id_farmers" : req.params.id_farmer,}]})
//   // Crop.find(
//   //   {
//   //     "id_farmers" : req.params.id_farmer,
//   //     "_id" : req.params.id_crop
//   //   }
//   //   )  
//   .then((hasil)=>{
//       if (hasil) {
//           res.statusCode = 200
//           res.setHeader('Content-type','application/json')
//           res.json(hasil) 
//       }
//       else{
//           res.statusCode = 404;
//           res.end('Hasil pertanian belum ada');
//       }
//   })
// })

module.exports = cropRouter;