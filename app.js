const express = require('express');
const mysql = require('mysql2');
const app = express();

// Cấu hình middleware để xử lý form
app.use(express.urlencoded({ extended: true }));

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Đã kết nối MySQL!');
});

// Route hiển thị form đăng nhập
app.get('/', (req, res) => {
    res.send(`
        <h2>Đăng nhập</h2>
        <form method="POST" action="/login">
            <label>Tên người dùng:</label><br>
            <input type="text" name="username"><br>
            <label>Mật khẩu:</label><br>
            <input type="password" name="password"><br>
            <input type="submit" value="Đăng nhập">
        </form>
    `);
});

// Route xử lý đăng nhập (cố tình để lỗ hổng SQL Injection)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Truy vấn dễ bị SQL Injection
    const query = `SELECT * FROM users WHERE username = '${username} AND password = '${password}'`;
    db.query(query, (err, results) => {
        console.log(query);
        if (err) throw err;

        if (results.length > 0) {
            console.log('Result:', results);
            res.send('<h3>Đăng nhập thành công!</h3>');
        } else {
            res.send('<h3>Sai tên người dùng hoặc mật khẩu!</h3>');
        }
    });
});

// Khởi động server
app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});