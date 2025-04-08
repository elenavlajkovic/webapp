import { Router } from 'express';
import { AdminController } from '../controllers/auth.controller';
import { authorizeAdmin } from '../middleware/admin-middleware';

const router = Router();


router.route("/loginAdmin").post(
  (req,res)=>new AdminController().loginAdmin(req,res)
)

router.route("/registrujStudenta").post(
  authorizeAdmin, (req,res)=>new AdminController().registrujStudenta(req,res)
)

router.route("/registrujProfesora").post(
  authorizeAdmin, (req,res)=>new AdminController().registrujProfesora(req,res)
)

router.route("/login").post(
  (req,res)=>new AdminController().login(req,res)
)

router.get('/adminMain', authorizeAdmin, (req, res) => {
  res.json({
      poruka: "admin"
  });
});

router.route("/dohvProfesore").get(
  (req,res)=>new AdminController().dohvProfesore(req,res)
)

//authorizeAdmin
router.route('/obrisiProfesora').post(
  authorizeAdmin, (req, res) => new AdminController().obrisiProfesora(req, res));

router.route("/dohvStudente").get(
  (req,res)=>new AdminController().dohvStudente(req,res)
)

//authorizeAdmin
router.route('/obrisiStudenta').post(
  authorizeAdmin, (req, res) => new AdminController().obrisiStudenta(req, res));

router.route("/promeniLozinku").post(
  (req,res)=>new AdminController().promeniLozinku(req,res)
)

router.route("/dohvPodatke/:kor_ime").get(
  (req,res)=>new AdminController().dohvPodatke(req,res)
)

router.route("/promeniLozinkuStudent").post(
  (req,res)=>new AdminController().promeniLozinkuStudent(req,res)
)

router.route("/profesor/:kor_ime").get(
  (req,res)=>new AdminController().dohvPodatkeProf(req,res)
)

router.route("/promeniGodinu/:kor_ime").post(
  (req,res)=>new AdminController().promeniGodinu(req,res)
)
export default router;
