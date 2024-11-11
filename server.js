const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, () => {
    console.log(`Example app listening on port`)
})

const carModel = require('./carModel');

const uri = 'mongodb+srv://admin1:OKxvTJqwobPZaJZG@cluster0.d13ikfs.mongodb.net/PH27669'

app.get('/', async (req, res) => {
    await mongoose.connect(uri);

    let cars = await carModel.find();
    console.log(cars)
    res.send(cars)

})

// hàm thêm
app.post('/add_xe', async (req, res) => {
    await mongoose.connect(uri);
    // let car = {
    //     ten: 'xe 3',
    //     namSX: 2020,
    //     hang: 'Vinfast',
    //     gia: 4500
    // }

     let car = req.body

    let kq = carModel.create(car);
    console.log(kq);

    let cars = await carModel.find();
    res.send(cars)
})


// hàm xóa
app.delete('/xoa/:id', async (req, res) => {
    await mongoose.connect(uri)

    let id = req.params.id;
    console.log(id)
    // xu ly loi khi id khong dung

    let car = await carModel.findById(id);
    if (!car) {
        return res.status(404).send({ message: 'Không thể xóa vì không tìm thấy ID gắn với xe này!' });
    }
    await carModel.deleteOne({ _id: id });
    res.redirect('../')

})

app.put('/update/:ten', async (req, res) => {
    await mongoose.connect(uri)
    console.log('Ket noi DB thanh cong')

    let tenXe = req.params.ten;
    console.log(tenXe);

    let tenXeMoi = tenXe + ' Phien ban moi ';

    await carModel.updateOne({ten: tenXe}, {ten: tenXeMoi})

    let xehois = await carModel.find({});

    res.send(xehois);

})

