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
        res.status(500).json({
            message: "Failed to get parts",
        });
    }
});

router.put("/update/:id", validateJWT, async (req, res) => {
    const { name, description, url, price, buildId } = req.body.part;
    const partsId = req.params.id;
    const { id } = req.user;

    try {
        const query = {
            where: {
                id: partsId,
                buildId: buildId,
            }
        };
        const updatedPart = {
            name: name,
            description: description,
            url: url,
            price: price,
        };
        console.log(updatedPart);
        try {
            const partHaveUpdated = await models.PartsModel.update(updatedPart, query);
            res.status(200).json({
                message: "part Updated",
                build: query,
                part: partHaveUpdated,
            })
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "cannot update part",
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err });
    }
},
);
//Delete Item from Build

router.delete("/delete/:id", validateJWT, async (req, res) => {
    const partsId = req.params.id;
    const { id } = req.user;

    try {
        const query = {
            where: {
                id: partsId,
                buildId: id,
            }
        };
        try {
            const partHaveDeleted = await models.PartsModel.destroy(query);
            res.status(200).json({
                message: "part Deleted",
                part: partHaveDeleted,
            })
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "cannot delete part",
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err });
    }
});
module.exports = router;