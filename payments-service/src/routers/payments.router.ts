import { Router } from 'express';
import { PaymentsController } from '../controllers/payments.controller';

const router = Router();

router.route("/dohvCene/:kor_ime").get(
    (req,res)=>new PaymentsController().dohvCene(req,res)
)

router.route("/cena").post(
    (req,res)=>new PaymentsController().postaviCene(req,res)
)

router.route("/dohvRokove").get(
    (req,res)=>new PaymentsController().dohvRokove(req,res)
)

router.route("/podaciOUplati").post(
    (req,res)=>new PaymentsController().podaciOUplati(req,res)
)

export default router;
