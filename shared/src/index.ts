// UTILS

export { slugify, isSlugified } from './utils/model.utils'

export { paginationDefault } from './utils/pagination.utils'

export { buildUrl, normalize, isNormalized, isEmail, isURL, isURLRelative, isPasswordStrong } from './utils/text.utils'

export { resolveType, sizeToReadable, mediaGetIcon, mediaGetLabel, isTypeAllowed } from './utils/media.utils'

export { parseValidationErrors } from './utils/validation.utils'

export { canDo, isAdmin, getPermsContexts, hasContext, getPerms } from './utils/auth.utils'

export { passwordGetScore, passwordGetMissing, passwordGetLevel } from './utils/password.utils'

export { isQueryValid } from './utils/global.utils'

// TYPES

export type { CategoryAttributes, CategoryAttributesCreation, CategoryAttributesUpdate } from './types/category.types'

export type { CouncilorAttributes, CouncilorAttributesCreation, CouncilorAttributesUpdate } from './types/councilor.types'

export type { CouncilReportAttributes, CouncilReportAttributesCreation, CouncilReportAttributesUpdate } from './types/councilReport.types'

export type { GalleryAttributes, GalleryAttributesFrontend, GalleryAttributesCreation, GalleryAttributesUpdate } from './types/gallery.types'

export type { HomeQuickAttributes, HomeQuickAttributesCreation, HomeQuickAttributesUpdate } from './types/homeQuick.types'

export { LOG_RENTENTION_DAYS, LOG_LEVELS_KEYS, LOG_LEVELS_OBJECTS } from './types/log.types'
export type { LogLevel, LogAttributes, LogAttributesCreation } from './types/log.types'

export { MEDIA_UPLOAD_UNIQUE_ATTEMPTS, MEDIA_UPLOAD_DIR, MEDIA_UPLOAD_URL, MEDIA_UPLOAD_SIZE_LIMIT, MEDIA_UPLOAD_NB_LIMIT, MEDIA_UPLOAD_ALLOWED, MEDIA_TYPES_KEYS, MEDIA_TYPES_OBJECTS } from './types/media.types'
export type { MediaType, MediaAttributes, MediaAttributesCreation, MediaAttributesUpdate } from './types/media.types'

export { MENU_SCOPES_KEYS, MENU_SCOPES_OBJECTS } from './types/menu.types'
export type { MenuScope, MenuAttributes, MenuAttributesFrontend, MenuAttributesCreation, MenuAttributesUpdate } from './types/menu.types'

export type { PostAttributeAttributes, PostAttributeAttributesCreation, PostAttributeAttributesUpdate } from './types/postAttribute.types'

export type { PopupAttributesFrontend, PopupAttributes, PopupAttributesCreation, PopupAttributesUpdate } from './types/popup.types'

export { POST_PROGESSIONS_KEYS, POST_PROGESSIONS_OBJECTS, POST_TYPES_KEYS, POST_STATUSES_KEYS, POST_STATUSES_OBJECTS } from './types/post.types'
export type { PostProgression, PostType, PostStatus, PostAttributes, PostAttributesFrontend, PostAttributesCreation, PostAttributesUpdate } from './types/post.types'

export { CATEGORIZABLE_TYPES_KEYS, CATEGORIZABLE_TYPES_OBJECTS } from './types/categorizable.types'
export type { CategorizableType, CategorizableAttributes, CategorizableAttributesCreation, CategorizableAttributesUpdate } from './types/categorizable.types'

export type { PracticalInformationAttributes, PracticalInformationAttributesCreation, PracticalInformationAttributesUpdate } from './types/practicalInformation.types'

export type { RoleAttributes, RoleAttributesCreation, RoleAttributesUpdate } from './types/role.types'

export { ROOM_RESERVATION_STATUSES_KEYS, ROOM_RESERVATION_STATUSES_OBJECTS } from './types/roomReservation.types'
export type { RoomReservationStatus, RoomReservationAttributes, RoomReservationAttributesCreation, RoomReservationAttributesUpdate } from './types/roomReservation.types'

export { SCHEDULE_DAYS_KEYS, SCHEDULE_DAYS_OBJECTS, SCHEDULE_TYPES_KEYS, SCHEDULE_TYPES_OBJECTS } from './types/schedule.types'
export type { ScheduleDay, ScheduleType, Time, TimeInterval, ScheduleAttributes, ScheduleAttributesCreation, ScheduleAttributesUpdate } from './types/schedule.types'

export type { SchoolYear, SchoolHolidayAttributes, SchoolHolidayAttributesCreation, SchoolHolidayAttributesUpdate, GovApiRecord, GovApiResponse } from './types/schoolHoliday.types'

export type { SchoolMealAttributes, SchoolMealAttributesCreation, SchoolMealAttributesUpdate } from './types/schoolMeal.types'

export type { SettingAttributes, SettingAttributesCreation, SettingAttributesUpdate } from './types/setting.types'

export { USER_ROLE_ID_DEFAULT, USER_STATUSES_KEYS, USER_STATUSES_OBJECTS } from './types/user.types'
export type { UserStatus, UserAttributes, UserAttributesAuth, UserAttributesFrontend, UserAttributesFrontendPassword, UserAttributesPublic, UserAttributesCreation, UserAttributesUpdate } from './types/user.types'

export type { SearchResultNames, SearchResultLinks, SearchResult } from './types/search.types'

export type { Pagination } from './types/pagination.types'

export type { Order } from './types/order.types'

export type { ContactRequest } from './types/contact.types'

export type { ValidationError, ValidationResult } from './types/validation.types'

export { AUTH_PASSWORD_RULES_SCORE_MAX, AUTH_PASSWORD_LEVELS, AUTH_PASSWORD_RULES, } from './types/password.types'

export { GLOBAL_SEARCH_LENGTH_MIN } from './types/global.types'