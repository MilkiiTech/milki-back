const {Sector, Zone, Woreda, User, Role}= require("../../../user/models/association");
const { Op } = require("sequelize");

exports.getOrganizationStructure = async (req, res, next)=>{
    try {
        // Get current user with their sector and role information
        const currentUser = await User.findByPk(req.user_id, {
            include: [{
                model: Sector,
                as: "sector",
                include: [{
                    model: Zone,
                }, {
                    model: Woreda,
                    include: {
                        model: Zone,
                        as: 'zone'
                    }
                }]
            }]
        });

        let organizationStructure = null;

        // If user is in a Zone-level sector
        if (currentUser?.sector?.Zone) {
            const zone_id = currentUser.sector.Zone.zone_id;
            
            // Get Zone structure with all its Woredas and Sectors
            organizationStructure = await Zone.findByPk(zone_id, {
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['user_id', 'username', 'email', 'phone_number']
                    },
                    {
                        model: Woreda,
                        include: [
                            {
                                model: User,
                                as: "user",
                                attributes: ['user_id', 'username', 'email', 'phone_number']
                            },
                            {
                                model: Sector,
                                include: {
                                    model: User,
                                    as: "user",
                                    attributes: ['user_id', 'username', 'email', 'phone_number']
                                }
                            }
                        ]
                    },
                    {
                        model: Sector,
                        include: {
                            model: User,
                            as: "user",
                            attributes: ['user_id', 'username', 'email', 'phone_number']
                        }
                    }
                ]
            });

            if (!organizationStructure) {
                return res.status(404).json({ message: "Zone structure not found" });
            }
        }
        // If user is in a Woreda-level sector
        else if (currentUser?.sector?.Woreda) {
            const woreda_id = currentUser.sector.Woreda.woreda_id;
            
            // Get Woreda structure with its Sectors
            organizationStructure = await Woreda.findByPk(woreda_id, {
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ['user_id', 'username', 'email', 'phone_number']
                    },
                    {
                        model: Zone,
                        as: "zone",
                        attributes: ['zone_id', 'zone_name']
                    },
                    {
                        model: Sector,
                        include: {
                            model: User,
                            as: "user",
                            attributes: ['user_id', 'username', 'email', 'phone_number']
                        }
                    }
                ]
            });

            if (!organizationStructure) {
                return res.status(404).json({ message: "Woreda structure not found" });
            }
        } else {
            return res.status(403).json({ 
                message: "You don't have permission to view organization structure" 
            });
        }

        return res.status(200).json({
            status: 'success',
            data: organizationStructure
        });

    } catch (error) {
        next(error);
    }
}