import multer from 'multer'
import { Router } from 'express'
import * as AuthItem from '../controllers/ItemsControllers'

const routers = Router()

const upload = multer({
    dest:'./tmp',
    fileFilter:(req,file,cb)=>{
        const allowed:string[] = ['image/jpg','image/jpeg','image/png']
        cb(null,allowed.includes(file.mimetype))
       },
       limits:{fieldSize:20000000}
       
   })

routers.post('/upload',upload.single('image'),AuthItem.upload)

export default routers
