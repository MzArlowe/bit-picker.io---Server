const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { models } = require("../models");

router.post("/create", validateJWT, async (req, res) => {
    const { id } = req.user;

    const { name, complete, totalPrice } = req.body.buildList;
    const NewBuild = {
        name,
        complete,
        totalPrice,
        price,
        userId: id,
    };
    try {
        const build = await models.BuildModel.create(NewBuild);
        res.status(200).json({
            message: "Component Added",
            build: build,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }

}
);

router.get("/", validateJWT, async (req, res) => {

    const { id } = req.user;

    const query = {
        where: {
            userId: id
        },
    }
    try {
        const builds = await models.BuildModel.findAll(query);
        res.status(200).json({
            message: "Builds found",
            builds: builds,
        })
    } catch (err) {
        res.status(500).json({ error: err, message: "Failed to get builds" });
    }
});

router.put("/update/:id", validateJWT, async (req, res) => {
    const { name, description, url, price } = req.body.build;
    const buildId = req.params.id;
    const { id } = req.user;

    const query = {
        where: {
            id: buildId,
            userId: id
        }
    };

    const updatedBuild = {
        name: name,
        description: description,
        url: url,
        price: price,
        // userId: id,
        // buildId
    };
    console.log(updatedBuild);

    try {
        const updatedBuild = await models.BuildModel.update(updatedBuild, query);
        res.status(200).json({
            message: "Build Updated",
            build: updatedBuild,
        })
    } catch (err) {
        res.status(500).json({ error: err });
    }
},
);
//Delete Total Build
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const buildId = req.params.id;
    const { id } = req.user;

    const query = {
        where: {
            id: buildId,
            owner: id
        }
    };
    try {
        const deletedBuild = await models.BuildModel.destroy(query);
        res.status(200).json({
            message: "Build Deleted",
            build: deletedBuild,
        })
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
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
            build: deletedPart,
        })
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
);
module.exports = router;
