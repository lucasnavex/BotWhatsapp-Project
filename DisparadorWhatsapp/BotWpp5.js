

const { Client, LocalAuth, MessageMedia, Contact, List, Location, Buttons } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const mime = require('mime-types');
const port = process.env.PORT || 8005;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
extended: true
}));
app.use(fileUpload({
debug: true
}));
app.use("/", express.static(__dirname + "/"))

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'bot-zdg5' }),
  puppeteer: { headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ] }
});

client.initialize();

io.on('connection', function(socket) {
  socket.emit('message', '© BOT-ZDG - Iniciado');
  

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', '© BOT-ZDG QRCode recebido, aponte a câmera  seu celular!');
    });
});

client.on('ready', () => {
    socket.emit('ready', '© BOT-ZDG Dispositivo pronto!');
    socket.emit('message', '© BOT-ZDG Dispositivo pronto!');
    socket.emit('qr', './check.svg')	
    console.log('© BOT-ZDG Dispositivo pronto');
});

client.on('authenticated', () => {
    socket.emit('authenticated', '© BOT-ZDG Autenticado!');
    socket.emit('message', '© BOT-ZDG Autenticado!');
    console.log('© BOT-ZDG Autenticado');
});

client.on('auth_failure', function() {
    socket.emit('message', '© BOT-ZDG Falha na autenticação, reiniciando...');
    console.error('© BOT-ZDG Falha na autenticação');
});

client.on('change_state', state => {
  console.log('© BOT-ZDG Status de conexão: ', state );
});

client.on('disconnected', (reason) => {
  socket.emit('message', '© BOT-ZDG Cliente desconectado!');
  console.log('© BOT-ZDG Cliente desconectado', reason);
  client.initialize();
});
});


app.post('/send-audio', async (req, res) => {
  const number = req.body.number;
  const filePath = "audio.opus";

  const cinco = number.length;
  const numberDDD = number.substr(0, 2);
  const numberDDDb = number.substr(2, 2);
  const numberUser = number.substr(-8, 8);
  const media = MessageMedia.fromFilePath(filePath);
  if (cinco >= 12) {
    
    if (numberDDD <= 30) {
      const numberZDG = "55" + numberDDDb + "9" + numberUser + "@c.us";
      client.sendMessage(numberZDG, media, {sendAudioAsVoice: true}).then(response => {
        res.status(200).json({
          status: true,
          response: response
        });
      }).catch(err => {
        res.status(500).json({
          status: false,
          response: err
        });
      });
    } else if (numberDDD > 30) {
      const numberZDG = "55" + numberDDDb + numberUser + "@c.us";
      client.sendMessage(numberZDG, media, {sendAudioAsVoice: true}).then(response => {
        res.status(200).json({
          status: true,
          response: response
        });
      }).catch(err => {
        res.status(500).json({
          status: false,
          response: err
        });
      });
    }
  } else {
    if (numberDDD <= 30) {
      const numberZDG = "55" + numberDDD + "9" + numberUser + "@c.us";
      client.sendMessage(numberZDG, media, {sendAudioAsVoice: true}).then(response => {
        res.status(200).json({
          status: true,
          response: response
        });
      }).catch(err => {
        res.status(500).json({
          status: false,
          response: err
        });
      });
    } else if (numberDDD > 30) {
      const numberZDG = "55" + numberDDD + numberUser + "@c.us";
      client.sendMessage(numberZDG, media, {sendAudioAsVoice: true}).then(response => {
        res.status(200).json({
          status: true,
          response: response
        });
      }).catch(err => {
        res.status(500).json({
          status: false,
          response: err
        });
      });
    }
  }
});

// Send message
app.post('/send-message', [
  body('number').notEmpty(),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = req.body.number;
  const cinco = number.length;
  const numberDDD = number.substr(0, 2);
  const numberDDDb = number.substr(2, 2);
  const numberUser = number.substr(-8, 8);
  const message = req.body.message;
  if (cinco >= 12) {
    
    if (numberDDD <= 30) {
      const numberZDG = "55" + numberDDDb + "9" + numberUser + "@c.us";
      client.sendMessage(numberZDG, message).then(response => {
        res.status(200).json({
          status: true,
          message: 'BOT-ZDG Mensagem enviada',
          response: response
        });
        }).catch(err => {
          res.status(500).json({
            status: false,
            message: 'BOT-ZDG Mensagem não enviada',
            response: err.text
          });
        });
    } else if (numberDDD > 30) {
      const numberZDG = "55" + numberDDDb + numberUser + "@c.us";
      client.sendMessage(numberZDG, message).then(response => {
      res.status(200).json({
        status: true,
        message: 'BOT-ZDG Mensagem enviada',
        response: response
      });
      }).catch(err => {
      res.status(500).json({
        status: false,
        message: 'BOT-ZDG Mensagem não enviada',
        response: err.text
      });
      });
    }
  } else {
    if (numberDDD <= 30) {
      const numberZDG = "55" + numberDDD + "9" + numberUser + "@c.us";
      client.sendMessage(numberZDG, message).then(response => {
      res.status(200).json({
        status: true,
        message: 'BOT-ZDG Mensagem enviada',
        response: response
      });
      }).catch(err => {
      res.status(500).json({
        status: false,
        message: 'BOT-ZDG Mensagem não enviada',
        response: err.text
      });
      });
    }
    else if (numberDDD > 30) {
      const numberZDG = "55" + numberDDD + numberUser + "@c.us";
      client.sendMessage(numberZDG, message).then(response => {
      res.status(200).json({
        status: true,
        message: 'BOT-ZDG Mensagem enviada',
        response: response
      });
      }).catch(err => {
      res.status(500).json({
        status: false,
        message: 'BOT-ZDG Mensagem não enviada',
        response: err.text
      });
      });
    }
  }
});

/* Send media
app.post('/send-media', async (req, res) => {
  const number = req.body.number;
  const numberDDD = number.substr(0, 2);
  const numberUser = number.substr(-8, 8);
  const caption = req.body.caption;
  const fileUrl = req.body.file;

  let mimetype;
  const attachment = await axios.get(fileUrl, {
    responseType: 'arraybuffer'
  }).then(response => {
    mimetype = response.headers['content-type'];
    return response.data.toString('base64');
  });

  const media = new MessageMedia(mimetype, attachment, 'Media');

  if (numberDDD <= 30) {
    const numberZDG = "55" + numberDDD + "9" + numberUser + "@c.us";
    client.sendMessage(numberZDG, media, {caption: caption}).then(response => {
    res.status(200).json({
      status: true,
      message: 'BOT-ZDG Imagem enviada',
      response: response
    });
    }).catch(err => {
    res.status(500).json({
      status: false,
      message: 'BOT-ZDG Imagem não enviada',
      response: err.text
    });
    });
  }

  else if (numberDDD > 30) {
    const numberZDG = "55" + numberDDD + numberUser + "@c.us";
    client.sendMessage(numberZDG, media, {caption: caption}).then(response => {
    res.status(200).json({
      status: true,
      message: 'BOT-ZDG Imagem enviada',
      response: response
    });
    }).catch(err => {
    res.status(500).json({
      status: false,
      message: 'BOT-ZDG Imagem não enviada',
      response: err.text
    });
    });
  }
});*/

//responsavel por coletar o contato do cliente que deseja o serviço
client.on("message", async (msg) => {
  if (
    msg.body === "1"
  ) {
    const contact = await msg.getContact();
    number = msg.from;
    const name = contact.pushname;
    const numberUser = number.substr(0, 12);
    var texto = `${numberUser} respondeu ${msg.body}\n`;
    
    client.sendMessage(
      msg.from,
      "Fico feliz que tenha se interessado em saber mais sobre!\n\nEstou encaminhando seu numero para nossa equipe especializada e ja entrarão em contato com voçe."
    );
    client.sendMessage(
      "553288284998@c.us",
      `[Nome]: ${name}\n[NUMERO]: ${numberUser}\n[MENSAGEM]: ${msg.body}\nInteressado no certificado digital!\nEntre em contato através do link: https://wa.me/${numberUser}`
    );
  } else if (
    msg.body === "2"
  ) {
    const contact = await msg.getContact();
    number = msg.from;
    const name = contact.pushname;
    const numberUser = number.substr(0, 12);
    var texto = `${numberUser} respondeu ${msg.body} não quer mais receber mensagem\n`;
    
    client.sendMessage(
      msg.from,
      "Tudo bem! Agradeço seu retorno!\nSeu numero ja foi tirado de nossas listas!\nMas sinta-se a vontade a entrar em contato caso mude de ideia! só digitar: Sim."
    );
  }/*else if (msg.body != null) {
    const contact = await msg.getContact();
    number = msg.from;
    const name = contact.pushname;
    const numberUser = number.substr(0, 12);
    var texto = `${numberUser} respondeu ${msg.body}\n`;
    fs.appendFile(texto, (err) => {});
  }*/
});

server.listen(port, function () {
  console.log("App running on *: " + port);
});