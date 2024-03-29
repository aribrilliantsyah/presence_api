const { user } = require("../../models")
const jwt = require('jsonwebtoken')
const Validator = require('validatorjs')
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Mailer = require('../../utils/Mailer')
const { genOTP } = require('../../utils/OtpCommon')
const salt = 10

class AuthController {
  async auth(req, res) {
    let rules = {
      username: 'required|alpha_dash',
      password: 'required',
      device_unique: 'required'
    }

    let validation = new Validator(req.body, rules)
    if (validation.fails()) {
      return res.status(422).json({
        status: false,
        message: 'form:is not complete',
        data: validation.errors.all()
      })
    }

    let { username, password, device_unique } = req.body

    try {
      let deciveUniqueUsed = await user.findOne({
        where: {
          device_unique,
          [Op.and]: Sequelize.where(Sequelize.col('username'), {
            [Op.not]: username
          })
        }
      })

      if (deciveUniqueUsed) {
        return res.json({
          "status": false,
          "message": "device: sudah tertaut pada akun lain, silakan untuk reset device unique"
        })
      }

      let auth = await user.findOne({
        where: {
          username: username,
        }
      })

      if (auth?.device_unique) {
        if (auth?.device_unique != device_unique) {
          return res.json({
            "status": false,
            "message": "device: berbeda dengan terakhir kali masuk, silakan untuk reset device unique"
          })
        }
      }

      if (!auth?.username) {
        return res.json({
          "status": false,
          "message": "username:not found"
        })
      }

      if (auth?.deletedAt != null) {
        return res.json({
          "status": false,
          "message": "user: telah di nonaktifkan"
        })
      }

      const passwordIsValid = await bcrypt.compare(password, auth?.password);

      if (!passwordIsValid) {
        return res.json({
          "status": false,
          "message": "password:not match"
        })
      }

      let payload = {
        username: auth.username,
        createdBy: auth.createdBy,
        updatedBy: auth.updatedBy,
        generate: new Date(),
      }

      let token = jwt.sign({ data: payload }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '24h'
      });

      await user.update({
        device_unique,
        token,
      }, {
        where: { id: auth?.id }
      })

      return res.json({
        "status": true,
        "message": "auth:success",
        "data": {
          "token": token,
          "account_type": auth.account_type
        }
      })

    } catch (error) {
      return res.json({
        "status": false,
        "message": error.message
      })
    }
  }

  async desktop_auth(req, res) {
    let rules = {
      username: 'required',
      password: 'required',
      device_uid: 'required',
    }

    let validation = new Validator(req.body, rules)
    if (validation.fails()) {
      return res.status(422).json({
        status: false,
        message: 'form:is not complete',
        data: validation.errors.all()
      })
    }

    let { username, password, device_uid } = req.body

    try {
      let deviceUIDUsed = await user.findOne({
        where: {
          device_uid: device_uid,
          [Op.and]: Sequelize.where(Sequelize.col('username'), {
            [Op.not]: username
          })
        }
      })

      if (deviceUIDUsed) {
        return res.json({
          "status": false,
          "message": "device_uid: sudah tertaut pada akun lain, silakan untuk reset device uid"
        })
      }

      let auth = await user.findOne({
        where: {
          username: username,
        }
      })

      if (auth?.device_tracker == false) {
        return res.json({
          "status": false,
          "message": "device_tracker:disabled"
        })
      }

      if (auth?.device_uid) {
        if (auth?.device_uid != device_uid) {
          return res.json({
            "status": false,
            "message": "device_uid: berbeda dengan terakhir kali masuk, silakan untuk reset device uid"
          })
        }
      }

      if (!auth?.username) {
        return res.json({
          "status": false,
          "message": "username:not found"
        })
      }

      if (auth?.deletedAt != null) {
        return res.json({
          "status": false,
          "message": "user: telah di nonaktifkan"
        })
      }

      const passwordIsValid = await bcrypt.compare(password, auth?.password);

      if (!passwordIsValid) {
        return res.json({
          "status": false,
          "message": "password:password invalid"
        })
      }

      if (!auth?.token || auth?.token == null) {
        return res.json({
          "status": false,
          "message": "token:not found"
        })
      }

      const token = auth?.token

      await user.update({
        device_uid: device_uid,
      }, {
        where: { id: auth?.id }
      })

      return res.json({
        "status": true,
        "message": "auth:success",
        "data": {
          "token": token
        }
      })

    } catch (error) {
      return res.json({
        "status": false,
        "message": error.message
      })
    }
  }

  async forgot_password(req, res) {
    try {
      let { email } = req.body

      if (!email) {
        return res.status(400).json({
          'message': 'validasi: email tidak boleh kosong'
        })
      }
      let checkUser = await user.findOne({ where: { email: email } })

      if (!checkUser?.email) {
        return res.status(200).json({
          'message': 'user: email not found'
        })
      }

      let otp = genOTP(6)

      await user.update({
        otp: otp
      }, {
        where: {
          id: checkUser.id
        }
      })

      let mailer = new Mailer({
        from: process.env.MAIL_SENDER
      });

      const otpStr = otp.toString();
      const otpArray = otpStr.split('');

      let otpHtml = '<!DOCTYPE html>\n<html>\n<head>\n';
      otpHtml += '<meta charset="UTF-8">\n';
      otpHtml += '<title>PT. Digital Amore Kriyanesia</title>\n';
      otpHtml += '</head>\n<body>\n';
      otpHtml += '<p>Jangan berikan OTP ini kepada siapapun, pergunakan untuk Anda sendiri</p>\n';
      otpHtml += '<p>' + otpStr + '</p>\n';
      otpHtml += '</body>\n</html>';

      mailer.prepare({
        to: email,
        subject: 'OTP untuk Ubah Password',
        text: `Jangan berikan OTP ini kepada siapapun, pergunakan untuk Anda sendiri: ${otp}`,
        html: otpHtml
      })
      await mailer.send()

      return res.status(200).json({
        'status': true,
        'message': 'silakan cek email'
      })

    } catch (error) {
      return res.json({
        "status": false,
        "message": error.message
      })
    }
  }

  async verify_otp(req, res) {
    try {
      let { email, otp } = req.body

      if (!email && !otp) {
        return res.status(400).json({
          'status': false,
          'message': 'validasi: email atau otp tidak boleh kosong'
        })
      }

      let userCheck = await user.findOne({ where: { email: email } })
      console.log(userCheck)

      if (!userCheck?.email) {
        return res.status(200).json({
          'message': 'user: email not found'
        })
      }

      if (userCheck.otp != otp) {
        return res.status(200).json({
          'status': false,
          'message': 'otp yang di masukan tidak cocok',
        })
      }

      await user.update({
        otp: null
      }, {
        where: {
          id: userCheck.id
        }
      })

      return res.status(200).json({
        'status': true,
        'message': 'otp yang di masukan cocok',
        'data': {
          'user_id': userCheck.id,
        }
      })
    } catch (error) {
      return res.json({
        "status": false,
        "message": error.message
      })
    }
  }

  async change_password(req, res) {
    try {
      let { id, password } = req.body

      if (!id && !password) {
        return res.status(400).json({
          'message': 'validasi: id atau password baru tidak boleh kosong'
        })
      }

      let userCheck = await user.findOne({ where: { id: id } })

      if (!userCheck?.username) {
        return res.status(200).json({
          'message': 'user: not found'
        })
      }

      await user.update({
        password: bcrypt.hashSync(password, salt)
      }, {
        where: {
          id: userCheck.id
        }
      })

      return res.status(200).json({
        'status': true,
        'message': 'password berhasil diubah',
      })
    } catch (error) {
      return res.json({
        "status": false,
        "message": error.message
      })
    }
  }
}

module.exports = AuthController