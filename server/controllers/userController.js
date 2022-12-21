const mysql = require('mysql');

// Bağlantı Havuzu
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Kullanıcıları Görüntüle
exports.view = (req, res) => {
  // Bağlantıyı kullan
  connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
    // Bağlantı bittiğinde, bırak
    if (!err) {
      let removedUser = req.query.removed;
      res.render('home', { rows, removedUser });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

// Aramaya Göre Kullanıcı Bul
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  // Bağlantıyı kullan
  connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      res.render('home', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

exports.form = (req, res) => {
  res.render('add-user');
}

// Yeni Kullanıcı Ekle
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  let searchTerm = req.body.search;

  // Bağlantıyı kullan
  connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
    if (!err) {
      res.render('add-user', { alert: 'Kullanıcı başarıyla eklendi.' });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


// Kullanıcıyı düzenle
exports.edit = (req, res) => {
  // Bağlantıyı kullan
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


// Kullanıcıyı Güncelle
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  // Bağlantıyı kullan
  connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {

    if (!err) {
      // Bağlantıyı kullan
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        // Bağlantı bittiğinde, bırak
        
        if (!err) {
          res.render('edit-user', { rows, alert: `${first_name} güncellendi.` });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

// Kullanıcıyı sil
exports.delete = (req, res) => {

  connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successeflly removed.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
    console.log('The data from beer table are: \n', rows);
  });

}

// Kullanıcıları Görüntüle
exports.viewall = (req, res) => {

  // Bağlantıyı kullan
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });

}