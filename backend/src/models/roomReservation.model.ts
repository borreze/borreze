import { DataTypes, Model, Sequelize } from 'sequelize'
import { ROOM_RESERVATION_STATUSES_KEYS, RoomReservationAttributes, RoomReservationAttributesCreation, RoomReservationStatus } from '@brz/shared'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const ROOM_RESERVATION_CONSTRAINTS = {
    id: {
        nicename: 'ID',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    applicant_name: {
        nicename: 'Nom',
        type: DataTypes.STRING,
        maxLength: 100,
        required: true,
        searchable: true
    },
    applicant_email: {
        nicename: 'Email du demandeur',
        type: DataTypes.STRING,
        maxLength: 255,
        required: true,
        searchable: true
    },
    applicant_phone: {
        nicename: 'Téléphone du demandeur',
        type: DataTypes.STRING,
        maxLength: 11, // Format: +1234567890
        required: true,
        searchable: true,
        pattern: /^\+?\d{10,11}$/
    },
    date_start: {
        nicename: 'Date de début',
        type: DataTypes.DATE,
        required: true
    },
    date_end: {
        nicename: 'Date de fin',
        type: DataTypes.DATE,
        required: true
    },
    note: {
        nicename: 'Note',
        type: DataTypes.STRING,
        maxLength: 1000,
        required: false,
        searchable: true
    },
    status: {
        nicename: 'Statut',
        type: DataTypes.ENUM(...ROOM_RESERVATION_STATUSES_KEYS),
        enum: ROOM_RESERVATION_STATUSES_KEYS,
        defaultValue: 'pending'
    },
    created_at: {
        nicename: 'Date de création',
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        nicename: 'Date de mise à jour',
        type: DataTypes.DATE,
        required: true,
        defaultValue: DataTypes.NOW
    }
} as const satisfies ModelConstraints<RoomReservationAttributes>

export class RoomReservation extends Model<RoomReservationAttributes, RoomReservationAttributesCreation> implements RoomReservationAttributes {
    public id!: number
    public applicant_name!: string
    public applicant_email!: string
    public applicant_phone!: string
    public date_start!: Date
    public date_end?: Date | null
    public note?: string
    public status!: RoomReservationStatus
    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initRoomReservationModel(sequelize: Sequelize) {
    RoomReservation.init(modelBuild(ROOM_RESERVATION_CONSTRAINTS), {
        sequelize,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        tableName: 'room_reservation',
        underscored: true,
        indexes: [
            { fields: ['status'] }
        ]
    })
}