import { Router } from 'express';
import { ExamsController } from '../controllers/exams.controllers';
import { authorizeProfessor } from '../../middleware/professor-middleware';
import { authorizeAdmin } from '../../middleware/admin-middleware';
const router = Router();

router.route("/dodajPredmet").post(
    authorizeAdmin, (req,res)=>new ExamsController().dodajPredmet(req,res)
)

router.route("/dohvPredmete").get(
    (req,res)=>new ExamsController().dohvPredmete(req,res)
)

router.route("/dodajIspitniRok").post(
    authorizeAdmin, (req,res)=>new ExamsController().dodajIspitniRok(req,res)
)

router.route("/dohvIspitneRokove").get(
    (req,res)=>new ExamsController().dohvIspitneRokove(req,res)
)

router.route("/obrisiProfesora").post(
    (req,res)=>new ExamsController().obrisiProfesora(req,res)
)

router.route("/dohvPredmeteZaProfesora/:kor_ime").get(
    (req,res)=>new ExamsController().dohvPredmeteZaProfesora(req,res)
)

router.route("/zakaziTermin").post(
    authorizeProfessor, (req,res)=>new ExamsController().zakaziTermin(req,res)
)

router.route("/dohvatiZakazaneTermine").get(
    (req,res)=>new ExamsController().dohvTermine(req,res)
)

router.route("/dohvIspiteProf/:kor_ime").get(
    (req,res)=>new ExamsController().dohvIspiteProf(req,res)
)

router.route("/obrisiTermin").post(
    (req,res)=>new ExamsController().obrisiTermin(req,res)
)

router.route("/dohvObavestenja/:kor_ime").get(
    (req,res)=>new ExamsController().dohvObavestenja(req,res)
)

router.route("/procitano").post(
    (req,res)=>new ExamsController().procitano(req,res)
)

router.route("/daLiJeProcitano").post(
    (req,res)=>new ExamsController().daLiJeProcitano(req,res)
)

router.route("/dohvPredmeteZaGodinu/:godina").get(
    (req,res)=>new ExamsController().dohvPredmeteZaGodinu(req,res)
)

router.route("/biranjePredmeta").post(
    (req,res)=>new ExamsController().biranjePredmeta(req,res)
)

router.route("/promeniBiranjePredmeta").post(
    (req,res)=>new ExamsController().promeniBiranjePredmeta(req,res)
)

router.route("/dohvBiranje").get(
    (req,res)=>new ExamsController().dohvBiranje(req,res)
)

router.route("/omoguciPrijavuIspitaZaRok").post(
    (req,res)=>new ExamsController().omoguciPrijavuIspitaZaRok(req,res)
)

router.route("/dohvIspiteZaRok/:pocetak/:kraj/:kor_ime").get(
    (req,res)=>new ExamsController().dohvIspiteZaRok(req,res)
)

router.route("/prijaviIspit").post(
    (req,res)=>new ExamsController().prijaviIspit(req,res)
)

router.route("/dohvPrijavljeneIspite/:kor_ime").get(
    (req,res)=>new ExamsController().dohvPrijavljeneIspite(req,res)
)

router.route("/odjaviIspit").post(
    (req,res)=>new ExamsController().odjaviIspit(req,res)
)

router.route("/dodeliSale").post(
    (req,res)=>new ExamsController().dodeliSale(req,res)
)

router.route("/dohvGotoveIspite/:kor_ime").get(
    (req,res)=>new ExamsController().dohvGotoveIspite(req,res)
)

router.route("/upisiOcenu").post(
    (req,res)=>new ExamsController().upisiOcenu(req,res)
)

router.route("/dohvOcene/:kor_ime").get(
    (req,res)=>new ExamsController().dohvOcene(req,res)
)

router.route("/zakaziCas").post(
    (req,res)=>new ExamsController().zakaziCas(req,res)
)

router.route("/dohvCasoveZaProf/:kor_ime").get(
    (req,res)=>new ExamsController().dohvCasoveZaProf(req,res)
)

router.route("/dohvCasoveZaStud/:kor_ime").get(
    (req,res)=>new ExamsController().dohvCasoveZaStudenta(req,res)
)

router.route("/upisSledeceGodine").post(
    (req,res)=>new ExamsController().upisSledeceGodine(req,res)
)


export default router;
