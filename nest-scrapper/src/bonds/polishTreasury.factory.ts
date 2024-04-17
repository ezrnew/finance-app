import { Model } from 'mongoose';
import { Coi, Edo, Ots, Rod, Ros, Tos } from './schemas/bonds.polishTreasury';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export type bondGlobalType = 'fixed' | 'reference' | 'cpi';

// export type bondCpiType = Edo | Coi | Ros | Rod;
// export type bondFixedType = Ots | Ots;
interface PolishTreasuryFactory {
  getModel(): Model<Edo | Coi | Ros | Rod | Ots | Ots>;
  getLengthInMonths(): number;
  getGlobalType(): bondGlobalType;
}

@Injectable()
export class EdoFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Edo.name) private edoModel: Model<Edo>) {}

  getModel(): Model<Edo> {
    return this.edoModel;
  }

  getLengthInMonths(): number {
    return 10 * 12;
  }

  getGlobalType(): bondGlobalType {
    return 'cpi';
  }
}

@Injectable()
export class CoiFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Coi.name) private coiModel: Model<Coi>) {}

  getModel(): Model<Coi> {
    return this.coiModel;
  }

  getLengthInMonths(): number {
    return 4 * 12;
  }
  getGlobalType(): bondGlobalType {
    return 'cpi';
  }
}

@Injectable()
export class RosFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Ros.name) private rosModel: Model<Ros>) {}

  getModel(): Model<Ros> {
    return this.rosModel;
  }

  getLengthInMonths(): number {
    return 6 * 12;
  }
  getGlobalType(): bondGlobalType {
    return 'cpi';
  }
}

@Injectable()
export class RodFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Rod.name) private rodModel: Model<Rod>) {}

  getModel(): Model<Rod> {
    return this.rodModel;
  }

  getLengthInMonths(): number {
    return 12 * 12;
  }
  getGlobalType(): bondGlobalType {
    return 'cpi';
  }
}

@Injectable()
export class OtsFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Ots.name) private otsModel: Model<Ots>) {}

  getModel(): Model<Ots> {
    return this.otsModel;
  }

  getLengthInMonths(): number {
    return 3;
  }
  getGlobalType(): bondGlobalType {
    return 'fixed';
  }
}

@Injectable()
export class TosFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Tos.name) private tosModel: Model<Tos>) {}

  getModel(): Model<Tos> {
    return this.tosModel;
  }

  getLengthInMonths(): number {
    return 3 * 12;
  }
  getGlobalType(): bondGlobalType {
    return 'fixed';
  }
}

@Injectable()
export class BondFactory {
  constructor(
    private readonly edoFactory: EdoFactory,
    private readonly coiFactory: CoiFactory,
    private readonly rosFactory: RosFactory,
    private readonly rodFactory: RodFactory,
    private readonly otsFactory: OtsFactory,
    private readonly tosFactory: TosFactory,
  ) {}

  getBondFactory(bondType: string): PolishTreasuryFactory {
    switch (bondType) {
      case 'EDO':
        return this.edoFactory;
      case 'COI':
        return this.coiFactory;
      case 'ROS':
        return this.rosFactory;
      case 'ROD':
        return this.rodFactory;
      case 'OTS':
        return this.otsFactory;
      case 'TOS':
        return this.tosFactory;

      default:
        throw new Error(`Invalid type: ${bondType}`);
    }
  }
}
