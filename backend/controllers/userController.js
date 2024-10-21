const userService = require('../services/userService');

const login = async (req, res) => {
    const { rollNo, password } = req.body;
    // console.log('Request body:', req.body);

    try {
        const result = await userService.loginUser(rollNo, password);
        // console.log('Login result:', result);
        res.status(200).json(result); // Add this to send a successful response
    } catch (err) {
        console.error('Error during login:', err); // Print the full error
        if (err.message === 'Invalid roll number or password') {
            res.status(401).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred', error: err.message });
        }
    }
};

module.exports = { login };
