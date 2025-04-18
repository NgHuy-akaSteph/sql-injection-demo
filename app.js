const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Cấu hình EJS làm template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cấu hình middleware để xử lý form
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
    res.render('login', { error: null });
});

// Route xử lý đăng nhập (cố tình để lỗ hổng SQL Injection)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Truy vấn dễ bị SQL Injection
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log('Câu truy vấn:', query);
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi:', err);
            return res.render('login', { 
                error: `Lỗi SQL: ${err.message}` 
            });
        }

        if (results.length > 0) {
            res.render('results', { 
                query: query,
                results: results 
            });
        } else {
            res.render('login', { 
                error: 'Đăng nhập không thành công' 
            });
        }
    });
});

// Khởi động server
app.listen(3000, () => {
    console.log('Server running......');
});