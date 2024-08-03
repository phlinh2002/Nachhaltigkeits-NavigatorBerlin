const express = require('express');
const MongoCRUDs = require('../mongodb/mongoCRUDs');
const mongoCRUDs = new MongoCRUDs();

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await mongoCRUDs.getAllUsers();
        res.json(users);
        if(users)
            res.status(200).json(users);
        else {
        res.status(404).send(`Users not found!`);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, password, firstname, role } = req.body;
        const user = await mongoCRUDs.createUser({ username, password, firstname, role });
        if (user) {
            res.status(201).json({ message: 'User created', userId: user });
        } else {
            res.status(400).send('User not created');
        }
    } catch (err) {
        res.status(500).send('Server Error');
        console.log(err)
    }
});
router.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const { username, password } = req.body;
        const user = await mongoCRUDs.findOneUser(username, password);
        if (user) {
            console.log("Serverantwort" + user)
            console.log("Serverantwort:", JSON.stringify(user, null, 2));
            res.status(200).json(user);
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await deleteLocation(req.params.id);
        if (deleted.deletedCount === 0) {
            res.status(404).send('Location not found');
        } else {
            res.status(200).send('Location deleted');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/', async (req, res) => {
    try {
        const result = await mongoCRUDs.deleteAllUsers();
        if (result.deletedCount > 0) {
            res.status(200).send(`${result.deletedCount} users deleted`);
        } else {
            res.status(404).send('No users to delete');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
