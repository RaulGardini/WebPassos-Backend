import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Aluno from "./Aluno";

interface PresencaAttributes {
    presenca_id: number;
    chamada_id: number;
    aluno_id: number;
    status: "presente" | "falta";
}

interface PresencaCreationAttributes
    extends Optional<PresencaAttributes, "presenca_id"> {
}

class Presenca extends Model<PresencaAttributes, PresencaCreationAttributes>
    implements PresencaAttributes {
    public presenca_id!: number;
    public chamada_id!: number;
    public aluno_id!: number;
    public status!: "presente" | "falta";
}

Presenca.init(
    {
        presenca_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        chamada_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chamadas',
                key: 'chamada_id'
            }
        },
        aluno_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'alunos',
                key: 'aluno_id'
            }
        },
        status: {
            type: DataTypes.ENUM("presente", "falta"),
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "presencas",
        timestamps: false,
    }
);
Presenca.belongsTo(Aluno, { foreignKey: 'aluno_id' });
export default Presenca;