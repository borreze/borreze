import { sequelize } from '../config/database'
import { initLogModel, Log } from './log.model'
import { initSchoolHolidayModel, SchoolHoliday } from './schoolHoliday.model'
import { initRoleModel, Role } from './role.model'
import { initUserModel, User } from './user.model'
import { initPostModel, Post } from './post.model'
import { initMenuModel, Menu } from './menu.model'
import { initHomeQuickModel, HomeQuick } from './homeQuick.model'
import { AuthRefreshToken, initAuthRefreshTokenModel } from './authRefreshToken.model'
import { AuthPasswordResetToken, initAuthPasswordResetTokenModel } from './authPasswordResetToken.model'
import { initCategoryModel, Category } from './category.model'
import { initCouncilorModel, Councilor } from './councilor.model'
import { initCouncilReportModel, CouncilReport } from './councilReport.model'
import { initSchoolMealModel, SchoolMeal } from './schoolMeal.model'
import { initRoomReservationModel, RoomReservation } from './roomReservation.model'
import { initSettingModel, Setting } from './setting.model'
import { initPostAttributeModel, PostAttribute } from './postAttribute.model'
import { initMediaModel, Media } from './media.model'
import { initPopupModel, Popup } from './popup.model'
import { initPracticalInformationModel, PracticalInformation } from './practicalInformation.model'
import { initCategorizableModel, Categorizable } from './categorizable.model'
import { initGalleryModel, Gallery } from './gallery.model'
import { initScheduleModel, Schedule } from './schedule.model'
import { initGalleryMediaModel, GalleryMedia } from './galleryMedia.model'

initLogModel(sequelize)
initSchoolHolidayModel(sequelize)
initRoleModel(sequelize)
initPostModel(sequelize)
initUserModel(sequelize)
initAuthRefreshTokenModel(sequelize)
initAuthPasswordResetTokenModel(sequelize)
initCategoryModel(sequelize)
initCouncilorModel(sequelize)
initCouncilReportModel(sequelize)
initSchoolMealModel(sequelize)
initRoomReservationModel(sequelize)
initSettingModel(sequelize)
initPostAttributeModel(sequelize)
initHomeQuickModel(sequelize)
initMediaModel(sequelize)
initPracticalInformationModel(sequelize)
initMenuModel(sequelize)
initCategorizableModel(sequelize)
initPopupModel(sequelize)
initGalleryModel(sequelize)
initGalleryMediaModel(sequelize)
initScheduleModel(sequelize)

Media.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' })
User.hasMany(Media, { foreignKey: 'uploaded_by', as: 'uploaded_media' })

Role.hasMany(User, { foreignKey: 'role_id', as: 'users' })
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' })

Post.belongsTo(Media, { foreignKey: 'cover_id', as: 'cover' })
Media.hasMany(Post, { foreignKey: 'cover_id', as: 'posts' })
Popup.belongsTo(Media, { foreignKey: 'media_id', as: 'media' })
Media.hasMany(Popup, { foreignKey: 'media_id', as: 'popups' })
CouncilReport.belongsTo(Media, { foreignKey: 'pdf_id', as: 'pdf' })
Media.hasMany(CouncilReport, { foreignKey: 'pdf_id', as: 'council_reports' })
Councilor.belongsTo(Media, { foreignKey: 'picture_id', as: 'picture' })
Media.hasMany(Councilor, { foreignKey: 'picture_id', as: 'councilors' })

Menu.belongsTo(Menu, { foreignKey: 'parent_id', as: 'parent' })
Menu.hasMany(Menu, { foreignKey: 'parent_id', as: 'children' })

PostAttribute.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })
Post.hasMany(PostAttribute, { foreignKey: 'post_id', as: 'attributes' })

Schedule.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })
Post.hasMany(Schedule, { foreignKey: 'post_id', as: 'schedules' })

Post.belongsTo(Gallery, { foreignKey: 'gallery_id', as: 'gallery' })
Gallery.hasMany(Post, { foreignKey: 'gallery_id', as: 'posts' })

Gallery.belongsToMany(Media, { through: GalleryMedia, foreignKey: 'gallery_id', otherKey: 'media_id', as: 'photos' })
Media.belongsToMany(Gallery, { through: GalleryMedia, foreignKey: 'media_id', otherKey: 'gallery_id', as: 'galleries' })

SchoolMeal.belongsTo(Media, { foreignKey: 'pdf_id', as: 'pdf' })
Media.hasMany(SchoolMeal, { foreignKey: 'pdf_id', as: 'school_meals' })

Post.belongsToMany(Category, { through: { model: Categorizable, scope: { type: 'post' } }, foreignKey: 'categorizable_id', otherKey: 'category_id', constraints: false, as: 'categories' })
Category.belongsToMany(Post, { through: { model: Categorizable, scope: { type: 'post' } }, foreignKey: 'category_id', otherKey: 'categorizable_id', constraints: false, as: 'posts' })

export {
    Log,
    SchoolHoliday,
    Post,
    Role,
    User,
    AuthRefreshToken,
    AuthPasswordResetToken,
    Category,
    Councilor,
    Menu,
    HomeQuick,
    CouncilReport,
    SchoolMeal,
    RoomReservation,
    Setting,
    PostAttribute,
    Media,
    Popup,
    PracticalInformation,
    Gallery,
    Schedule,
    GalleryMedia,
}