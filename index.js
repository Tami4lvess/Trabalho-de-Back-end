const express = require('express');
const app = express();
const PORT = 3000;


app.use(express.json());

// ROTA DE TESTE
app.get('/', (req, res) => {
  res.send('🌺Servidor funcionando🌺');
});

/*
========================
ROTA CLIMA (wttr.in)
========================
*/
app.get('/clima', async (req, res) => {
  const { cidade } = req.query;

  if (!cidade) {
    return res.status(400).json({
      erro: 'Passe uma cidade: /clima?cidade=São Paulo'
    });
  }

  try {
    const url = `https://wttr.in/${encodeURIComponent(cidade)}?format=j1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro na API externa');
    }

    const data = await response.json();

    // validação aqui dentro 
    if (!data.current_condition) {
      return res.status(404).json({
        erro: 'Cidade não encontrada'
      });
    }

    const resultado = {
      cidade,
      temperatura: data.current_condition[0].temp_C + '°C',
      sensacao: data.current_condition[0].FeelsLikeC + '°C',
      descricao: data.current_condition[0].weatherDesc[0].value
    };

    res.json(resultado);

  } catch (erro) {
    res.status(500).json({
      erro: 'Erro ao buscar clima',
      detalhe: erro.message
    });
  }
});

// START
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});