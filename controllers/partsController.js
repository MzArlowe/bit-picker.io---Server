const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { models } = require("../models");

router.post("/create", validateJWT, async (req, res) => {
    // const { id } = req.user;

    const { name, description, url, price, buildId } = req.body.part;
    const NewPart = {
        name,
        description,
        url,
        price,
        buildId: buildId,
    };
    try {
        const part = await models.PartsModel.create(NewPart);
        res.status(200).json({
            message: "Component Added",
            part: part,
        })
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
);

router.get("/:id", validateJWT, async (req, res) => {

    const { id } = req.params;
    try {
        const query = await models.BuildModel.findOne({
            where: {
                id: id,
            }
        })

        const parts = await models.PartsModel.findAll({
            where: {
                buildId: id
            }
        })

        res.status(200).json({
            message: "all parts",
            build: query,
            parts: parts,
        })
    } catch (err) {
        res.status(500).json({ error: err, message: "Failed to get parts" });
    }
});

router.put("/update/:id", validateJWT, async (req, res) => {
    const { name, description, url, price, partsId } = req.body.part;
    const partsId = req.params.id;
    const { id } = req.user;

    try {
        const query = {
            where: {
                id: partsId,
            }
        };
        const updatedPart = {
            name: name,
            description: description,
            url: url,
            price: price,
            partsId: id
        };
        console.log(updatedPart);
        const partUpdated = await models.PartsModel.update(updatedPart, query);
        res.status(200).json({
            message: "part Updated",
            build: query,
            part: partUpdated,
        })
        
    } catch (err) {
        res.status(500).json({ error: err });
    }
},
);
//Delete Item from Sections
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const partId = req.params.id;
    const { id } = req.user;
    // console.log(id);
    // console.log(req.params, 'req.params');

    const query = {
        where: {
            id: partId,
            owner: id
        }
    };
    try {
        const deletedPart = await models.PartsModel.destroy(query);
        res.status(200).json({
            message: "Part Removed",
            part: deletedPart,
        })
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
);
module.exports = router;