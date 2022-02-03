const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { models } = require("../models");

router.post("/create", validateJWT, async (req, res) => {
    // const { id } = req.user;

    const { name, description, url, price, buildId, owner } = req.body.part;
    const NewPart = {
        name,
        description,
        url,
        price,
        // buildId: buildId,
        owner: owner,
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

    const query = {
        where: {
            buildId: id,
            userId: req.user.id
        },
    }
    try {
        const parts = await models.PartsModel.findAll(query);
        res.status(200).json({
            message: "parts added",
            parts: parts,
        })
    } catch (err) {
        res.status(500).json({ error: err, message: "Failed to get parts" });
    }
});

router.put("/update/:id", validateJWT, async (req, res) => {
    const { name, description, url, price, owner, } = req.body.part;
    const partsId = req.params.id;
    const { id } = req.user;

    const query = {
        where: {
            id: partsId,
            owner: id
        }
    };

    const updatedPart = {
        name: name,
        description: description,
        url: url,
        price: price,
        owner: owner
        // owner: id
    };
    console.log(updatedPart);

    try {
        const partUpdated = await models.PartsModel.update(updatedPart, query);
        res.status(200).json({
            message: "part Updated",
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