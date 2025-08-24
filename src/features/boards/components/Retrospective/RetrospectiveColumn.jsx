import { useStore } from "@store/store";
import { TrashIcon, PlusIcon, StarFilledIcon } from "@radix-ui/react-icons";
import * as Form from '@radix-ui/react-form';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import Button from '@components/Button/Button';
import styles from './Retrospective.module.scss';
import Row from "@components/Row/Row";
import { updateBoard } from '@features/boards/services/boardsQuery';

const RetrospectiveColumn = ({ type }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const intl = useIntl();
    const user = useStore((state) => state.user);
    const userEmail = user.providerData[0].email;
    const activeBoardId = useStore((state) => state.activeBoardId);
    const boards = useStore((state) => state.boards);
    const board = boards.find(board => board.id === activeBoardId);

    const handleUpdateRetrospective = (data) => {
        const { message } = data;

        updateBoard(board.id, {
            sprints: board.sprints.map(sprint => {
                if (sprint.id === board.activeSprint) {
                    return {
                        ...sprint,
                        retrospective: {
                            ...sprint.retrospective,
                            [type]: [
                                ...(sprint.retrospective?.[type] || []),
                                { 
                                    id: Date.now(), 
                                    message, 
                                    author: userEmail,
                                    voteList: []
                                }
                            ]
                        }
                    };
                }
                return sprint;
            })
        });

        reset();
    }

    const handleDeleteRetrospectiveItem = (id) => {
        updateBoard(board.id, {
            sprints: board.sprints.map(sprint => {
                if (sprint.id === board.activeSprint) {
                    return {
                        ...sprint,
                        retrospective: {
                            ...sprint.retrospective,
                            [type]: sprint.retrospective[type].filter(item => item.id !== id) || []
                        }
                    };
                }
                return sprint;
            })
        });
    };

    const handleVoteRetrospectiveItem = (id) => {
        updateBoard(board.id, {
            sprints: board.sprints.map(sprint => {
                if (sprint.id === board.activeSprint) {
                    return {
                        ...sprint,
                        retrospective: {
                            ...sprint.retrospective,
                            [type]: sprint.retrospective[type].map(item => {
                                if (item.id === id && !item.voteList.includes(userEmail)) {
                                    return {
                                        ...item,
                                        voteList: [...item.voteList, userEmail]
                                    };
                                } else if (item.id === id && item.voteList.includes(userEmail)) {
                                    return {
                                        ...item,
                                        voteList: item.voteList.filter(email => email !== userEmail)
                                    };
                                }
                                return item;
                            })
                        }
                    };
                }
                return sprint;
            })
        });
    }

    return (
        <div className={styles.column}>
            <h4 className={styles.title}>
                <FormattedMessage id={`boards.retrospective.${type}`} />
            </h4>

            <div className={styles.listWrapper}>
                <ul className={styles.list}>
                    {board.sprints.find(sprint => sprint.id === board.activeSprint).retrospective[type]?.map(item => (
                        <li key={item.id} className={styles.listItem}>
                            <p>{item.message}</p>

                            <div className={styles.actions}>
                                <div className={styles.voteContainer}>
                                    <span className={styles.voteCount}>{item.voteList?.length || 0}</span>

                                    <Button variant="icon" 
                                            disabled={item.author === userEmail}
                                            variation="transparent"
                                            onClick={() => handleVoteRetrospectiveItem(item.id)}>

                                        <StarFilledIcon className={item.voteList?.length > 0 ? styles.hasVotes : ''} />
                                    </Button>
                                </div>

                                {(item.author === userEmail || board.owner.email === userEmail) && (
                                    <Button variant="icon" variation="transparent" onClick={() => handleDeleteRetrospectiveItem(item.id)}>
                                        <TrashIcon />
                                    </Button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <Form.Root onSubmit={handleSubmit(handleUpdateRetrospective)}>
                <Row>
                    <Field name="message" required errors={errors}>
                        <Input
                            register={register}
                            name="message"
                            placeholder={intl.formatMessage({ id: 'boards.retrospective.placeholder.message' })}
                            errors={errors}
                            required={intl.formatMessage({ id: 'common.required' })}
                            maxLength={{
                                value: 100,
                                message: intl.formatMessage({ id: 'boards.validation.boardNameMaxLength' }, { length: 100 })
                            }}
                        />
                    </Field>
                    <Button type="submit" variation="confirmation">
                        <PlusIcon width={18} height={18} />
                    </Button>
                </Row>
            </Form.Root>
        </div>
    );
}

export default RetrospectiveColumn;
