"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const admin_middleware_1 = require("../middleware/admin-middleware");
const router = (0, express_1.Router)();
router.route("/loginAdmin").post((req, res) => new auth_controller_1.AdminController().loginAdmin(req, res));
router.route("/registrujStudenta").post(admin_middleware_1.authorizeAdmin, (req, res) => new auth_controller_1.AdminController().registrujStudenta(req, res));
router.route("/registrujProfesora").post(admin_middleware_1.authorizeAdmin, (req, res) => new auth_controller_1.AdminController().registrujProfesora(req, res));
router.route("/login").post((req, res) => new auth_controller_1.AdminController().login(req, res));
router.get('/adminMain', admin_middleware_1.authorizeAdmin, (req, res) => {
    res.json({
        poruka: "admin"
    });
});
router.route("/dohvProfesore").get((req, res) => new auth_controller_1.AdminController().dohvProfesore(req, res));
//authorizeAdmin
router.route('/obrisiProfesora').post(admin_middleware_1.authorizeAdmin, (req, res) => new auth_controller_1.AdminController().obrisiProfesora(req, res));
router.route("/dohvStudente").get((req, res) => new auth_controller_1.AdminController().dohvStudente(req, res));
//authorizeAdmin
router.route('/obrisiStudenta').post(admin_middleware_1.authorizeAdmin, (req, res) => new auth_controller_1.AdminController().obrisiStudenta(req, res));
router.route("/promeniLozinku").post((req, res) => new auth_controller_1.AdminController().promeniLozinku(req, res));
router.route("/dohvPodatke/:kor_ime").get((req, res) => new auth_controller_1.AdminController().dohvPodatke(req, res));
router.route("/promeniLozinkuStudent").post((req, res) => new auth_controller_1.AdminController().promeniLozinkuStudent(req, res));
router.route("/profesor/:kor_ime").get((req, res) => new auth_controller_1.AdminController().dohvPodatkeProf(req, res));
router.route("/promeniGodinu/:kor_ime").post((req, res) => new auth_controller_1.AdminController().promeniGodinu(req, res));
exports.default = router;
