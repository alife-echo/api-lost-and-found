import multer from 'multer'
import { Router } from 'express'
import { Auth } from '../middlewares/Auth'
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

routers.get('/list-items',Auth.private,ItemControllers.getListItems)

routers.post('/upload',upload.single('image'),ItemControllers.upload)

routers.post('/send-response-item',ItemControllers.responseItem)

routers.get('/filterCard',Auth.private,ItemControllers.filterCard)

routers.get('/userlostItems/:userId',Auth.private,ItemControllers.getUserLostItems)

routers.get('/forum/:id',Auth.private,ItemControllers.getItem)



export default routers
