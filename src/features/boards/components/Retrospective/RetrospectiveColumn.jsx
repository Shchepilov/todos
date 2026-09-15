import { cn } from 'cn';
import { useStore } from "@store/store";
import { useAuthUser } from "@baseUrl/auth/useAuthUser";
import { TrashIcon, PlusIcon, StarFilledIcon } from "@radix-ui/react-icons";
import * as Form from '@radix-ui/react-form';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import Input from "@components/Input/Input";
import Field from "@components/Field/Field";
import Button from '@components/Button/Button';
import styles from './Retrospective.module.scss';
import Row from "@components/Row/Row";
import { addRetrospectiveItem, deleteRetrospectiveItem, toggleRetrospectiveVote } from '@features/boards/services/boardsQuery';
import { getRetrospectiveItems } from '@features/boards/utils/helpers';
import useActiveSprint from '@features/boards/hooks/useActiveSprint';

const RetrospectiveColumn = ({ type }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const intl = useIntl();
    const user = useAuthUser();
    const userEmail = user.providerData[0].email;
    const activeBoardId = useStore((state) => state.activeBoardId);
    const boards = useStore((state) => state.boards);
    const board = boards.find(board => board.id === activeBoardId);
    const activeSprint = useActiveSprint(board);

    const items = getRetrospectiveItems(board, activeSprint, type);

    const handleUpdateRetrospective = (data) => {
        if (!activeSprint) return;

        addRetrospectiveItem(board.id, activeSprint, type, {
            message: data.message,
            author: userEmail,
            voteList: [],
        });

        reset();
    }

    const handleDeleteRetrospectiveItem = (id) => {
        deleteRetrospectiveItem(board.id, activeSprint, type, id);
    };

    const handleVoteRetrospectiveItem = (item) => {
        toggleRetrospectiveVote(board.id, activeSprint, type, item.id, userEmail, item.voteList?.includes(userEmail));
    }

    return (
        <div className={styles.column}>
            <h4 className={styles.title}>
                <FormattedMessage id={`boards.retrospective.${type}`} />
            </h4>

            <div className={styles.listWrapper}>
                <ul className={styles.list}>
                    {items.map(item => (
                        <li key={item.id} className={styles.listItem}>
                            <p>{item.message}</p>

                            <div className={styles.actions}>
                                <div className={styles.voteContainer}>
                                    <span className={styles.voteCount}>{item.voteList?.length || 0}</span>

                                    <Button variant="icon" 
                                            disabled={item.author === userEmail}
                                            variation="transparent"
                                            onClick={() => handleVoteRetrospectiveItem(item)}>

                                        <StarFilledIcon className={cn(item.voteList?.length > 0 && styles.hasVotes)} />
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
