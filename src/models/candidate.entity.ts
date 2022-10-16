import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['electionId', 'userId'], { unique: true })
export class Candidate {

    @PrimaryGeneratedColumn()
    candidateId: number;

    @Column({ type: 'int', comment: '选举ID' })
    electionId: number

    @Column({ type: 'int', comment: '用户ID' })
    userId: number

}
