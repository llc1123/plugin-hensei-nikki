import { createSelector } from 'reselect'
import memoize from 'fast-memoize'
import {
  constSelector,
  equipDataSelectorFactory,
  shipDataSelectorFactory,
  extensionSelectorFactory,
} from 'views/utils/selectors'

const REDUCER_EXTENSION_KEY = 'poi-plugin-hensei-nikki'

const { resources } = window.i18n

const getI18n = s => resources.fixedT ? resources.fixedT(s, { keySeparator: false }) : resources.__(s)

export const initStatusSelector = createSelector(
  extensionSelectorFactory(REDUCER_EXTENSION_KEY),
  state => ({ init: (state.initStatus || {init: false}).init })
)

export const henseiDataSelector = createSelector(
  extensionSelectorFactory(REDUCER_EXTENSION_KEY),
  state => state.henseiData || {}
)

export const fleetsByTitleSelector = (title) =>
  createSelector(henseiDataSelector, ({ data }) => ({ fleets: (data[title] || { fleets: {} }).fleets }))

export const dataByTitleSelector = (title) =>
  createSelector(henseiDataSelector, ({ data }) => ({ data: (data || {})[title] || {} }))

export const constShipInfoSelector = memoize(id =>
  createSelector(constSelector, ({ $ships, $shipTypes }) => ({
    name: getI18n(($ships[id] || { api_name: '' }).api_name),
    type: getI18n($shipTypes[$ships[id].api_stype].api_name),
  }))
)
export const constEquipInfoSelector = memoize(id =>
  createSelector(constSelector, ({ $equips }) => ({
    name: getI18n(($equips[id] || { api_name: '' }).api_name),
    iconId: $equips[id] ? $equips[id].api_type[3] : 0,
  }))
)
// { name, lv, type, saku, slots }
export const getShipInfoByData = memoize((id, { lv, saku, slots }) => {
  return createSelector(
    constShipInfoSelector(id),
    ({ name, type }) => ({
      name,
      type,
      saku,
      lv,
      slots,
    }))
})
export const getShipInfoByApi = memoize(id =>
  createSelector([
    shipDataSelectorFactory(id),
    constSelector,
  ], ([ship, $ship], { $shipTypes }) => {
    const slots = []
    if (ship) {
      slots.push(...ship.api_slot)
      if (ship.api_slot_ex) {
        const ex = slots.pop()
        slots.ex = ex
      }
    }
    return {
      name: getI18n(($ship || { api_name: '' }).api_name),
      lv: ship ? ship.api_lv : 0,
      saku: ship.api_sakuteki[0],
      type: getI18n($shipTypes[$ship ? $ship.api_stype : 0].api_name),
      slots,
    }
  })
)

export const shipInfoSelector = (id, ship) => getShipInfoByData(id, ship)
  // ship.saku ? getShipInfoByData(id, ship) : getShipInfoByApi(id)


export const getEquipInfoByData = memoize((id, { lv, alv }) =>
  createSelector(constEquipInfoSelector(id), ({ name, iconId }) => ({ name, iconId, lv, alv }))
)
export const getEquipInfoByApi = memoize(id =>
  createSelector(equipDataSelectorFactory(id), ([equip, $equip]) => ({
    name: ($equip || { api_name: '' }).api_name,
    iconId: $equip ? $equip.api_type[3] : 0,
    lv: equip.api_level,
    alv: equip.api_alv,
  }))
)
export const equipInfoSelector = (id, slot) =>
  id ? getEquipInfoByData(id, slot) : getEquipInfoByApi(Number(slot))
