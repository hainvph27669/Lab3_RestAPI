// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const carModel = require('./carModel'); // Đảm bảo đường dẫn đến file model chính xác
const apiMobile = require('./api');
const COMMON = require('./COMMON');

const app = express(); // Khởi tạo app trước khi sử dụng

const port = 3000;

// MongoDB URI
const uri = COMMON.uri;

// Kết nối MongoDB
mongoose.connect(uri)
    .then(() => console.log('Kết nối MongoDB thành công'))
    .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Định tuyến API
app.use('/api', apiMobile); // Đảm bảo đặt sau khi khởi tạo `app`

// Lấy danh sách xe
app.get('/', async (req, res) => {
    try {
        let cars = await carModel.find();
        console.log(cars);
        res.send(cars);
    } catch (err) {
        res.status(500).send({ message: 'Lỗi lấy dữ liệu xe', error: err.message });
    }
});

// Thêm xe mới
app.post('/add_xe', async (req, res) => {
    try {
        let car = req.body;
        let kq = await carModel.create(car); // Sử dụng `await` để chờ MongoDB thêm xong
        console.log('Thêm xe thành công:', kq);

        let cars = await carModel.find();
        res.send(cars);
    } catch (err) {
        res.status(500).send({ message: 'Lỗi thêm xe', error: err.message });
    }
});

// Xóa xe theo ID
app.delete('/xoa/:id', async (req, res) => {
    let id = req.params.id;

    try {
        let car = await carModel.findById(id);
        if (!car) {
            return res.status(404).send({ message: 'Không thể xóa vì không tìm thấy ID gắn với xe này!' });
        }
        await carModel.deleteOne({ _id: id });
        res.send({ message: 'Xóa xe thành công' });
    } catch (err) {
        res.status(500).send({ message: 'Lỗi xóa xe', error: err.message });
    }
});

// Cập nhật tên xe
app.put('/update/:ten', async (req, res) => {
    let tenXe = req.params.ten;
    let tenXeMoi = tenXe + ' Phiên bản mới';

    try {
        await carModel.updateOne({ ten: tenXe }, { ten: tenXeMoi });
        let xehois = await carModel.find({});
        res.send(xehois);
    } catch (err) {
        res.status(500).send({ message: 'Lỗi cập nhật xe', error: err.message });
    }
});

// Bắt đầu lắng nghe trên cổng
app.listen(port, () => {
    console.log(`Server đang chạy trên cổng ${port}`);
});
