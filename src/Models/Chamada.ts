import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Presenca from "./Presenca";

interface ChamadaAttributes {
    chamada_id: number;
    turma_id: number;
    colaborador_id: number;
    data_aula: Date;
}

interface ChamadaCreationAttributes 
    extends Optional<ChamadaAttributes, "chamada_id"> {
}

class Chamada extends Model<ChamadaAttributes, ChamadaCreationAttributes>
    implements ChamadaAttributes {
    public chamada_id!: number;
    public turma_id!: number;
    public colaborador_id!: number;
    public data_aula!: Date;
}

Chamada.init(
    {
        chamada_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        turma_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'turmas',
                key: 'turma_id'
            }
        },
        colaborador_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'colaboradores',
                key: 'colaborador_id'
            }
        },
        data_aula: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "chamadas",
        timestamps: false,
    }
);
Chamada.hasMany(Presenca, { 
    foreignKey: 'chamada_id', 
    as: 'presencas' 
});

export default Chamada;