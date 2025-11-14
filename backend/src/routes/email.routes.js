const express = require('express');
const router = express.Router();
const { sendMail } = require('../services/mailer');

router.post('/enviar-email', async (req, res) => {
  try {
    await sendMail(req.body.email, "Teste", "Olá, esse é um teste!");
    res.json({ message: "Email enviado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao enviar e-mail", details: error.message });
  }
});

module.exports = router;
