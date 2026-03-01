import { DataTypes, Model, Sequelize } from 'sequelize'
import { RoomReservationAttributes, RoomReservationAttributesCreation, RoomReservationStatus } from '../types/models/roomReservation.types'
import { ModelConstraints } from '../types/utils/model.types'
import { modelBuild } from '../utils/model.utils'

export const ROOM_RESERVATION_STATUSES = ['pending', 'accepted', 'rejected'] as const

export const ROOM_RESERVATION_CONSTRAINTS = {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    applicant_name: {
        type: DataTypes.STRING,
        maxLength: 100,
        required: true,
        searchable: true
    },
    applicant_email: {
        type: DataTypes.STRING,
        maxLength: 255,
        required: true,
        searchable: true
    },
    applicant_phone: {
        type: DataTypes.STRING,
        maxLength: 11, // Format: +1234567890
        required: true,
        searchable: true,
        pattern: /^\+?\d{10,11}$/
    },
    date_start: {
        type: DataTypes.DATE,
        required: true
    },
    date_end: {
        type: DataTypes.DATE,
        required: true
    },
    note: {
        type: DataTypes.STRING,
        maxLength: 1000,
        required: false,
        searchable: true
    },
    status: {
        type: DataTypes.ENUM(...ROOM_RESERVATION_STATUSES),
        enum: ROOM_RESERVATION_STATUSES,
        defaultValue: 'pending'
    },
    created_at: {
        type: DataTypes.DATE,
        required: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        required: true,
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