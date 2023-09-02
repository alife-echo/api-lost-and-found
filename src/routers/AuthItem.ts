import multer from 'multer'
import { Router } from 'express'
import * as ItemControllers from '../controllers/ItemsControllers'

const routers = Router()

const upload = multer({
    dest:'./tmp',
    fileFilter:(req,file,cb)=>{
        const allowed:string[] = ['image/jpg','image/jpeg','image/png']
        cb(null,allowed.includes(file.mimetype))
       },
       limits:{fieldSize:20000000}
       
   })

routers.get('/list-items',ItemControllers.getListItems)
   
routers.post('/upload',upload.single('image'),ItemControllers.upload)

export default routers
