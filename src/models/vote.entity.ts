import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['candidateId', 'voterId'], { unique: true })
export class Vote {

    @PrimaryGeneratedColumn()
    voteId: number;

    @Column({ type: 'int', comment: '候选者ID' })
    candidateId: number

    @Column({ type: 'int', comment: '投票者ID' })
    voterId: number

}
