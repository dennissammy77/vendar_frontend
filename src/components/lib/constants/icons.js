import { CiCalendarDate, CiExport, CiGrid42, CiImport, CiWarning } from "react-icons/ci";
import { FaInstagram, FaLongArrowAltLeft, FaPhone, FaStore, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { FaLocationDot, FaWandMagicSparkles, FaXTwitter } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GiShoppingBag } from "react-icons/gi";
import { GrFormEdit, GrMoney } from "react-icons/gr";
import { HiChevronDown } from "react-icons/hi";
import { IoIosPerson, IoMdSettings } from "react-icons/io";
import { IoPeopleOutline, IoReload } from "react-icons/io5";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { MdAdd, MdAddShoppingCart, MdChevronLeft, MdChevronRight, MdClose, MdDeleteForever, MdDeleteOutline, MdDone, MdEmail, MdFilterAlt, MdFilterAltOff, MdOutlineAdminPanelSettings, MdOutlineManageAccounts, MdSupportAgent } from "react-icons/md";
import { TiUserDelete } from "react-icons/ti";
import { BsBoxSeam } from "react-icons/bs";
import { VscDiscard } from "react-icons/vsc";
import { BsBell } from "react-icons/bs";
import { BiTransferAlt } from "react-icons/bi";

export const FILTER_ICON = (props)=> <MdFilterAlt {...props}/>
export const FILTER_ICON_CLOSE = (props)=> <MdFilterAltOff {...props}/>
export const IMPORT_ICON = (props)=> <CiImport {...props}/>
export const EXPORT_ICON = (props)=> <CiExport {...props}/>
export const CHEVRON_RIGHT_ICON = (props)=> <MdChevronRight {...props}/>
export const CHEVRON_LEFT_ICON = (props)=> <MdChevronLeft {...props}/>
export const CHEVRON_DOWN_ICON = (props)=> <HiChevronDown {...props}/>
export const ADD_ICON = (props)=> <MdAdd {...props}/>
export const SEARCH_ICON = (props)=> <FiSearch {...props}/>
export const CLEAR_FILTER_ICON = (props)=> <MdDeleteForever {...props}/>
export const PRODUCT_ICON = (props)=> <GiShoppingBag {...props}/>
export const MANAGE_ICON = (props)=> <IoMdSettings {...props}/>
export const TRANSACTION_ICON = (props)=> <LiaMoneyBillWaveSolid {...props}/>
export const PEOPLE_ICON = (props)=> <IoPeopleOutline {...props}/>
export const STORE_ICON = (props)=> <FaStore {...props}/>
export const INSTAGRAM_ICON = (props)=> <FaInstagram {...props}/>
export const TIKTOK_ICON = (props)=> <FaTiktok {...props}/>
export const WHATSAPP_ICON = (props)=> <FaWhatsapp {...props}/>
export const LOCATION_ICON = (props)=> <FaLocationDot {...props}/>
export const TWITTER_ICON = (props)=> <FaXTwitter {...props}/>
export const EMAIL_ICON = (props)=> <MdEmail {...props}/>
export const PHONE_ICON = (props)=> <FaPhone {...props}/>
export const SPARKS_ICON = (props)=> <FaWandMagicSparkles {...props}/>
export const EDIT_ICON = (props)=> <GrFormEdit {...props}/>
export const DELETE_ICON = (props)=> <MdDeleteOutline {...props}/>
export const DONE_ICON = (props)=> <MdDone {...props}/>
export const CLOSE_ICON = (props)=> <MdClose {...props}/>
export const USER_DELETE_ICON = (props)=> <TiUserDelete {...props}/>
export const SHOPPING_CART_ICON = (props)=> <MdAddShoppingCart {...props}/>
export const HOME_ICON = (props)=> <CiGrid42 {...props}/>
export const PICKUPS_ICON = (props)=> <BsBoxSeam {...props}/>
export const STAFF_ICON = (props)=> <MdOutlineAdminPanelSettings {...props}/>
export const ACCOUNT_SETTINGS_ICON = (props)=> <MdOutlineManageAccounts {...props}/>
export const SUPPORT_ICON = (props)=> <MdSupportAgent {...props}/>
export const DISCARD_ICON = (props)=> <VscDiscard {...props}/>
export const PERSON_ICON = (props)=> <IoIosPerson {...props}/>
export const MONEY_COINS_ICON = (props)=> <GrMoney {...props}/>
export const CALENDER_ICON = (props)=> <CiCalendarDate {...props}/>
export const WARNING_ICON = (props)=> <CiWarning {...props}/>
export const LEFT_ARROW_ICON = (props)=> <FaLongArrowAltLeft {...props}/>
export const RELOAD_ICON = (props)=> <IoReload {...props}/>
export const NOTIFICATIONS_ICON = (props)=> <BsBell {...props}/>
export const TRANSFER_ICON = (props) => <BiTransferAlt {...props}/>
