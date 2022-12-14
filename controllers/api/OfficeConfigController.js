const { office_config, user } = require("../../models")
const Validator = require('validatorjs')

class OfficeConfigController {
  async list(req, res) {
    try {
      let officeConfig = await office_config.findOne({
        where: {
          id: 1
        }
      })

      return res.json({
        "status": true,
        "message": "office_config:success",
        "data": officeConfig
      })

    } catch (error) {
      return res.json({
        "status": false,
        "message": error.message
      }) 
    }
  }

  async update(req, res) {
    let rules = {
        name: 'required',
        theme: 'required',
        logo: 'required',
        latitude: 'required',
        longitude: 'required',
        radius: 'required',
        amount_of_annual_leave: 'required',
        work_schedule: 'required',
        updated_by: 'required'
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'form:is not complete',
        data: validation.errors.all()
      })
    }

    let { 
        name,
        theme,
        logo,
        latitude,
        longitude,
        radius,
        amount_of_annual_leave,
        work_schedule,
        updated_by
    } = req.body

    let id = req.params.id

    try {
      let officeConfig = await office_config.findOne({
        where: {
          id: id,
        }
      })

      if(!officeConfig?.id){
        return res.json({
          "status": false,
          "message": "office_config:not found"
        })
      }

      let oUser = await user.findOne({
        where: {
          id: updated_by,
        }
      })
  
      if(!oUser?.username){
        return res.json({
          "status": false,
          "message": "user:not found"
        })
      }
      
      const data  = {
        name: name,
        theme: theme,
        logo: logo,
        latitude: latitude,
        longitude: longitude,
        radius: radius,
        amount_of_annual_leave: amount_of_annual_leave,
        work_schedule: work_schedule,
        updated_by: updated_by,
        updatedAt: new Date()
      }

      await office_config.update(data, {
        where: { id: id }
      })

      return res.json({
        "status": true,
        "message": "office_config:updated",
        "data": data
      })

    } catch (error) {
      return res.json({
        "status": false,
        "message": error.message
      }) 
    }
  }
}

module.exports = OfficeConfigController