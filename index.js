const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const sequelize = require('./database');
const User = require('./Models/User');
const Cart = require('./Models/Cart');
const Product = require('./Models/Product');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const secretKey = 'nik852';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
  try{
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const hashPassword = bcrypt.hashSync(password, 10)

  const user = await User.create({ name, email, password: hashPassword, role });

  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

  res.json({ user, token });
}
catch(e){
  res.status(400).json({message: `${e}`})
}
});

app.post('/login', async (req, res) => {
  try{
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Такой email незарегистрирован' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Неверный пароль' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

  res.json({ user, token });
}
  catch(e){
    console.log(e)
    res.status(400).json({message: 'Login error'})
  }
});

const getCurrentUserCart = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    Cart.findOne({ where: { userId } })
      .then(cart => {
        if (cart) {
          req.cart = cart;
          next();
        } else {
          res.status(404).json({ error: 'Cart not found.' });
        }
      })
      .catch(error => {
        res.status(500).json({ error: 'Error finding cart.' });
      });
  };
  
  app.get('/cart', getCurrentUserCart, async (req, res) => {
    res.json(req.cart);
  });
  
  app.post('/cart/:productId', getCurrentUserCart, async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (product) {
      await req.cart.addProduct(product);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  });
  
  app.delete('/cart/:productId', getCurrentUserCart, async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (product) {
      await req.cart.removeProduct(product);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  });

const checkAdmin = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    User.findByPk(userId)
      .then(user => {
        if (user.role === 'admin') {
          next();
        } else {
          res.status(401).json({ error: 'Not authorized to perform this action.' });
        }
      })
      .catch(error => {
        res.status(401).json({ error: 'Invalid token.' });
      });
  };
  
  app.get('/products', async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
  });
  
  app.post('/products', checkAdmin, async (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    const product = await Product.create({ name, description, price, imageUrl });
    res.json(product);
  });
  
  app.delete('/products/:id', checkAdmin, async (req, res) => {
    const productId = req.params.id;
    await Product.destroy({ where: { id: productId } });
    res.json({ success: true });
  });

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});