import mongodb from 'mongodb'
import { PaintColor } from '../enums/PAINT_COLOR.js'
import {
  PriceDataDocument,
  PriceDocument,
  PriceRange,
  BlueprintPricesDocument,
} from './PriceDocument.js'
import BaseModel from '../base/BaseModel.js'

export class PriceDataModel {
  paint: PaintColor
  pc?: PriceRange
  ps?: PriceRange
  xbox?: PriceRange
  switch?: PriceRange
  bp?: BlueprintPricesDocument

  fromDocument({
    bp,
    pc,
    ps,
    xbox,
    paintId,
    ...data
  }: PriceDataDocument): PriceDataModel {
    this.bp = bp
    this.pc = pc
    this.ps = ps
    this.xbox = xbox
    this.paint = PaintColor.fromValue(paintId)
    this.switch = data.switch

    return this
  }

  toDocument(): PriceDataDocument {
    return {
      paintId: this.paint.value,
      bp: this.bp,
      pc: this.pc,
      ps: this.ps,
      xbox: this.xbox,
      switch: this.switch,
    }
  }
}

export class PriceModel extends BaseModel {
  createDate: Date
  pvId: mongodb.ObjectId
  data: PriceDataModel[]

  fromDocument({ _id, createDate, pvId, data }: PriceDocument): PriceModel {
    this._id = _id
    this.createDate = createDate
    this.pvId = pvId
    this.data = data.map((price) => new PriceDataModel().fromDocument(price))

    return this
  }

  toDocument(): PriceDocument {
    return {
      _id: this._id,
      createDate: this.createDate || new Date(),
      pvId: this.pvId,
      data: this.data.map((priceData) => priceData.toDocument()),
    }
  }
}
