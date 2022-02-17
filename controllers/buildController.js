const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { models } = require("../models");

router.post("/create", validateJWT, async (req, res) => {
    const { id } = req.user;

    const { name, description, complete, totalPrice } = req.body.buildList;
    const NewBuild = {
        name,
        description,
        complete,
        totalPrice,
        userId: id
    };
    try {
        const build = await models.BuildModel.create(NewBuild);
        res.status(200).json({
            message: "Build Created",
            build: build,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.get("/", validateJWT, async (req, res) => {

    // const { id } = req.params;
    const { id } = req.user;

    try {
        const query = await models.UserModel.findOne({
            where: {
                id: id,
            }
        })

        const builds = await models.BuildModel.findAll({
            where: {
                userId: id
            }
        })

        res.status(200).json({
            message: "Builds found",
            user: query,
            builds: builds,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to get builds", 
        })
    }
});

router.put("/update/:id", validateJWT, async (req, res) => {
    const { name, complete, totalPrice } = req.body.build;
    const buildId = req.params.id;
    const { id } = req.user;

    const query = {
        where: {
            id: buildId,
            userId: id,
        }
    };

    const updatedBuild = {
        name: name,
        complete: complete,
        totalPrice: totalPrice,
    };
    console.log(updatedBuild);
    try {
        const updated = await models.BuildModel.update(updatedBuild, query);
        res.status(200).json({
            message: "Build Updated",
            user: query,
            build: updated,
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to update build",
        });
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
module.exports = router;
