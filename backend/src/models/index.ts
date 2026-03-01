import { sequelize } from '../config/database'
import { initLogModel, Log } from './log.model'
import { initSchoolHolidayModel, SchoolHoliday } from './schoolHoliday.model'
import { initRoleModel, Role } from './role.model'
import { initUserModel, User } from './user.model'
import { initPostModel, Post } from './post.model'
import { initPageModel, Page } from './page.model'
import { initMenuModel, Menu } from './menu.model'
import { AuthRefreshToken, initAuthRefreshTokenModel } from './authRefreshToken.model'
import { AuthPasswordResetToken, initAuthPasswordResetTokenModel } from './authPasswordResetToken.model'
import { initCategoryModel, Category } from './category.model'
import { initEventModel, Event } from './event.model'
import { initProjectModel, Project } from './project.model'
import { initAssociationModel, Association } from './association.model'
import { initCommerceModel, Commerce } from './commerce.model'
import { initCouncilorModel, Councilor } from './councilor.model'
import { initCouncilReportModel, CouncilReport } from './councilReport.model'
import { initSchoolMealModel, SchoolMeal } from './schoolMeal.model'
import { initRoomReservationModel, RoomReservation } from './roomReservation.model'
import { initSettingModel, Setting } from './setting.model'
import { initPageAttributeModel, PageAttribute } from './pageAttribute.model'
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
initEventModel(sequelize)
initProjectModel(sequelize)
initAssociationModel(sequelize)
initCommerceModel(sequelize)
initCouncilorModel(sequelize)
initCouncilReportModel(sequelize)
initSchoolMealModel(sequelize)
initRoomReservationModel(sequelize)
initSettingModel(sequelize)
initPageAttributeModel(sequelize)
initMediaModel(sequelize)
initPracticalInformationModel(sequelize)
initMenuModel(sequelize)
initCategorizableModel(sequelize)
initPopupModel(sequelize)
initPageModel(sequelize)
initGalleryModel(sequelize)
initGalleryMediaModel(sequelize)
initScheduleModel(sequelize)

Media.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' })
User.hasMany(Media, { foreignKey: 'uploaded_by', as: 'uploaded_media' })

Role.hasMany(User, { foreignKey: 'role_id', as: 'users' })
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' })

Page.belongsTo(Media, { foreignKey: 'cover_id', as: 'cover' })
Media.hasMany(Page, { foreignKey: 'cover_id', as: 'pages' })
Association.belongsTo(Media, { foreignKey: 'cover_id', as: 'cover' })
Media.hasMany(Association, { foreignKey: 'cover_id', as: 'associations' })
Post.belongsTo(Media, { foreignKey: 'cover_id', as: 'cover' })
Media.hasMany(Post, { foreignKey: 'cover_id', as: 'posts' })
Commerce.belongsTo(Media, { foreignKey: 'cover_id', as: 'cover' })
Media.hasMany(Commerce, { foreignKey: 'cover_id', as: 'commerces' })
Event.belongsTo(Media, { foreignKey: 'cover_id', as: 'cover' })
Media.hasMany(Event, { foreignKey: 'cover_id', as: 'events' })
Popup.belongsTo(Media, { foreignKey: 'media_id', as: 'media' })
Media.hasMany(Popup, { foreignKey: 'media_id', as: 'popups' })
Project.belongsTo(Media, { foreignKey: 'cover_id', as: 'cover' })
Media.hasMany(Project, { foreignKey: 'cover_id', as: 'projects' })
CouncilReport.belongsTo(Media, { foreignKey: 'pdf_id', as: 'pdf' })
Media.hasMany(CouncilReport, { foreignKey: 'pdf_id', as: 'council_reports' })
Councilor.belongsTo(Media, { foreignKey: 'picture_id', as: 'picture' })
Media.hasMany(Councilor, { foreignKey: 'picture_id', as: 'councilors' })

Menu.belongsTo(Menu, { foreignKey: 'parent_id', as: 'parent' })
Menu.hasMany(Menu, { foreignKey: 'parent_id', as: 'children' })

PageAttribute.belongsTo(Page, { foreignKey: 'page_id', as: 'page' })
Page.hasMany(PageAttribute, { foreignKey: 'page_id', as: 'attributes' })

Schedule.belongsTo(Commerce, { foreignKey: 'commerce_id', as: 'commerce' })
Commerce.hasMany(Schedule, { foreignKey: 'commerce_id', as: 'schedules' })

Page.belongsTo(Gallery, { foreignKey: 'gallery_id', as: 'gallery' })
Gallery.hasMany(Page, { foreignKey: 'gallery_id', as: 'pages' })
Event.belongsTo(Gallery, { foreignKey: 'gallery_id', as: 'gallery' })
Gallery.hasMany(Event, { foreignKey: 'gallery_id', as: 'events' })

Gallery.belongsToMany(Media, { through: GalleryMedia, foreignKey: 'gallery_id', otherKey: 'media_id', as: 'photos' })
Media.belongsToMany(Gallery, { through: GalleryMedia, foreignKey: 'media_id', otherKey: 'gallery_id', as: 'galleries' })

SchoolMeal.belongsTo(Media, { foreignKey: 'pdf_id', as: 'pdf' })
Media.hasMany(SchoolMeal, { foreignKey: 'pdf_id', as: 'school_meals' })

Post.belongsToMany(Category, { through: { model: Categorizable, scope: { type: 'post' } }, foreignKey: 'categorizable_id', otherKey: 'category_id', constraints: false, as: 'categories' })
Category.belongsToMany(Post, { through: { model: Categorizable, scope: { type: 'post' } }, foreignKey: 'category_id', otherKey: 'categorizable_id', constraints: false, as: 'posts' })
Event.belongsToMany(Category, { through: { model: Categorizable, scope: { type: 'event' } }, foreignKey: 'categorizable_id', otherKey: 'category_id', constraints: false, as: 'categories' })
Category.belongsToMany(Event, { through: { model: Categorizable, scope: { type: 'event' } }, foreignKey: 'category_id', otherKey: 'categorizable_id', constraints: false, as: 'events' })
Project.belongsToMany(Category, { through: { model: Categorizable, scope: { type: 'project' } }, foreignKey: 'categorizable_id', otherKey: 'category_id', constraints: false, as: 'categories' })
Category.belongsToMany(Project, { through: { model: Categorizable, scope: { type: 'project' } }, foreignKey: 'category_id', otherKey: 'categorizable_id', constraints: false, as: 'projects' })
Commerce.belongsToMany(Category, { through: { model: Categorizable, scope: { type: 'commerce' } }, foreignKey: 'categorizable_id', otherKey: 'category_id', constraints: false, as: 'categories' })
Category.belongsToMany(Commerce, { through: { model: Categorizable, scope: { type: 'commerce' } }, foreignKey: 'category_id', otherKey: 'categorizable_id', constraints: false, as: 'commerces' })
Association.belongsToMany(Category, { through: { model: Categorizable, scope: { type: 'association' } }, foreignKey: 'categorizable_id', otherKey: 'category_id', constraints: false, as: 'categories' })
Category.belongsToMany(Association, { through: { model: Categorizable, scope: { type: 'association' } }, foreignKey: 'category_id', otherKey: 'categorizable_id', constraints: false, as: 'associations' })

export {
    Log,
    SchoolHoliday,
    Post,
    Role,
    User,
    AuthRefreshToken,
    AuthPasswordResetToken,
    Category,
    Event,
    Project,
    Association,
    Commerce,
    Councilor,
    Menu,
    CouncilReport,
    Page,
    SchoolMeal,
    RoomReservation,
    Setting,
    PageAttribute,
    Media,
    Popup,
    PracticalInformation,
    Gallery,
    Schedule,
    GalleryMedia,
}